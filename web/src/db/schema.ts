// Esquema de la base de datos (Neon Postgres + Drizzle). Ver docs/05-arquitectura.md.
import { relations, sql } from "drizzle-orm";
import { bigint, boolean, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

const creado = () => timestamp("creado", { withTimezone: true }).notNull().defaultNow();

// ---------------------------------------------------------------- Better Auth
// Nombres de tabla y campos que espera Better Auth (adaptador Drizzle, modo camelCase en el código).

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

// Límite de intentos de Better Auth (guardado en la base: en serverless la memoria no se comparte).
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

// ---------------------------------------------------------------- Negocio

export const categoria = pgTable("categoria", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull().default(""),
  orden: integer("orden").notNull().default(0),
});

export const producto = pgTable(
  "producto",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    categoriaId: integer("categoria_id")
      .notNull()
      .references(() => categoria.id),
    nombre: text("nombre").notNull(),
    descripcion: text("descripcion").notNull().default(""),
    personalizacion: text("personalizacion").array().notNull().default(sql`'{}'::text[]`),
    tamano: text("tamano"),
    plazo: text("plazo").notNull().default("15 a 20 días hábiles"),
    ocasiones: text("ocasiones").array().notNull().default(sql`'{}'::text[]`),
    // Solo lo que ella publicó (con fuente y año) y, aparte, el precio que ella confirme.
    precioReferencia: jsonb("precio_referencia"),
    precioConfirmado: integer("precio_confirmado"),
    destacado: boolean("destacado").notNull().default(false),
    activo: boolean("activo").notNull().default(true),
    orden: integer("orden").notNull().default(0),
    creado: creado(),
    actualizado: timestamp("actualizado", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("producto_categoria_idx").on(t.categoriaId)],
);

export const foto = pgTable(
  "foto",
  {
    id: serial("id").primaryKey(),
    productoId: integer("producto_id")
      .notNull()
      .references(() => producto.id, { onDelete: "cascade" }),
    // Ruta base sin sufijo: /img/p/<slug>/01 (estática) o la clave en R2.
    clave: text("clave").notNull(),
    origen: text("origen").notNull().default("estatica"), // estatica | r2
    alt: text("alt").notNull().default(""),
    ancho: integer("ancho").notNull(),
    alto: integer("alto").notNull(),
    mejoradaIa: boolean("mejorada_ia").notNull().default(false),
    orden: integer("orden").notNull().default(0),
  },
  (t) => [index("foto_producto_idx").on(t.productoId)],
);

export const cliente = pgTable(
  "cliente",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    nombre: text("nombre").notNull(),
    whatsapp: text("whatsapp").notNull(),
    ciudad: text("ciudad").notNull().default(""),
    notas: text("notas").notNull().default(""),
    creado: creado(),
  },
  (t) => [uniqueIndex("cliente_whatsapp_idx").on(t.whatsapp), index("cliente_user_idx").on(t.userId)],
);

export const ESTADOS_PEDIDO = [
  "solicitud",
  "cotizado",
  "anticipo_recibido",
  "en_proceso",
  "listo",
  "enviado",
  "entregado",
  "cancelado",
] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

export const pedido = pgTable(
  "pedido",
  {
    id: serial("id").primaryKey(),
    codigo: text("codigo").notNull().unique(), // MH4-XXXX
    clienteId: integer("cliente_id")
      .notNull()
      .references(() => cliente.id),
    productoId: integer("producto_id").references(() => producto.id, { onDelete: "set null" }),
    // Lo que escribió el cliente: detalle, colores, tamaño, producto elegido (por si luego cambia).
    detalle: jsonb("detalle").notNull(),
    estado: text("estado").$type<EstadoPedido>().notNull().default("solicitud"),
    urgente: boolean("urgente").notNull().default(false),
    fechaDeseada: text("fecha_deseada"), // AAAA-MM-DD, como la escribió
    fechaEstimada: text("fecha_estimada"),
    total: integer("total"),
    anticipo: integer("anticipo"),
    cuotas: integer("cuotas"),
    notasInternas: text("notas_internas").notNull().default(""),
    creado: creado(),
  },
  (t) => [index("pedido_cliente_idx").on(t.clienteId), index("pedido_estado_idx").on(t.estado)],
);

export const pedidoEvento = pgTable(
  "pedido_evento",
  {
    id: serial("id").primaryKey(),
    pedidoId: integer("pedido_id")
      .notNull()
      .references(() => pedido.id, { onDelete: "cascade" }),
    estado: text("estado").$type<EstadoPedido>().notNull(),
    nota: text("nota").notNull().default(""),
    creado: creado(),
  },
  (t) => [index("pedido_evento_pedido_idx").on(t.pedidoId)],
);

// Agenda abierta/cerrada, textos, mostrar precios, datos de pago privados…
export const ajustes = pgTable("ajustes", {
  clave: text("clave").primaryKey(),
  valor: jsonb("valor").notNull(),
  actualizado: timestamp("actualizado", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------- Relaciones

export const categoriaRel = relations(categoria, ({ many }) => ({ productos: many(producto) }));
export const productoRel = relations(producto, ({ one, many }) => ({
  categoria: one(categoria, { fields: [producto.categoriaId], references: [categoria.id] }),
  fotos: many(foto),
}));
export const fotoRel = relations(foto, ({ one }) => ({
  producto: one(producto, { fields: [foto.productoId], references: [producto.id] }),
}));
export const clienteRel = relations(cliente, ({ many, one }) => ({
  pedidos: many(pedido),
  usuario: one(user, { fields: [cliente.userId], references: [user.id] }),
}));
export const pedidoRel = relations(pedido, ({ one, many }) => ({
  cliente: one(cliente, { fields: [pedido.clienteId], references: [cliente.id] }),
  producto: one(producto, { fields: [pedido.productoId], references: [producto.id] }),
  eventos: many(pedidoEvento),
}));
export const pedidoEventoRel = relations(pedidoEvento, ({ one }) => ({
  pedido: one(pedido, { fields: [pedidoEvento.pedidoId], references: [pedido.id] }),
}));
