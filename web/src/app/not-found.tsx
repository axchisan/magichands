import Link from "next/link";

export default function NoEncontrada() {
  return (
    <div className="envoltura" style={{ padding: "5rem 0", display: "grid", gap: "1rem", justifyItems: "start" }}>
      <h1 style={{ fontSize: "var(--t-5)" }}>Esta página no existe</h1>
      <p>Puede que el enlace esté mal escrito o que el producto ya no esté en el catálogo.</p>
      <Link href="/catalogo" className="boton boton-principal">
        Ir al catálogo
      </Link>
    </div>
  );
}
