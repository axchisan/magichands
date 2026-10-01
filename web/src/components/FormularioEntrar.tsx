"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authCliente } from "@/lib/auth-cliente";
import estilos from "./FormularioEntrar.module.css";

export function FormularioEntrar({
  destino,
  errorGoogle = false,
}: {
  destino: string;
  errorGoogle?: boolean;
}) {
  const router = useRouter();
  const [paso, setPaso] = useState<"inicio" | "correo" | "codigo">("inicio");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState(
    errorGoogle
      ? "No pudimos completar el acceso con Google. Inténtalo de nuevo o usa tu correo."
      : "",
  );
  const [cargando, setCargando] = useState<"" | "google" | "correo" | "codigo">(
    "",
  );
  const codigoRef = useRef<HTMLInputElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (paso === "codigo") codigoRef.current?.focus();
    if (paso === "correo") correoRef.current?.focus();
  }, [paso]);

  async function conGoogle() {
    setError("");
    setCargando("google");
    const r = await authCliente.signIn.social({
      provider: "google",
      callbackURL: destino,
      errorCallbackURL: "/entrar?error=google",
    });
    if (r?.error) {
      setError("No pudimos abrir Google. Inténtalo de nuevo.");
      setCargando("");
    }
  }

  async function pedirCodigo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando("correo");
    const { error } = await authCliente.emailOtp.sendVerificationOtp({
      email: correo.trim(),
      type: "sign-in",
    });
    setCargando("");
    if (error) {
      setError(
        error.status === 429
          ? "Pediste varios códigos seguidos. Espera un minuto e inténtalo otra vez."
          : "No pudimos enviar el código. Revisa el correo e inténtalo de nuevo.",
      );
      return;
    }
    setPaso("codigo");
  }

  async function verificar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando("codigo");
    const otp = String(
      new FormData(e.currentTarget).get("codigo") ?? "",
    ).replace(/\D/g, "");
    const { error } = await authCliente.signIn.emailOtp({
      email: correo.trim(),
      otp,
    });
    if (error) {
      setCargando("");
      setError(
        error.status === 429
          ? "Demasiados intentos. Espera un minuto."
          : "El código no es correcto o ya venció. Revísalo o pide uno nuevo.",
      );
      return;
    }
    router.push(destino);
    router.refresh();
  }

  return (
    <div className={estilos.caja}>
      {paso !== "codigo" ? (
        <>
          <button
            type="button"
            className={estilos.google}
            onClick={conGoogle}
            disabled={!!cargando}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6a5.1 5.1 0 0 1-2.2 3.3v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2Z"
              />
              <path
                fill="#34A853"
                d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 9.9l3.7-2.8Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4Z"
              />
            </svg>
            {cargando === "google"
              ? "Abriendo Google…"
              : "Continuar con Google"}
          </button>

          {paso === "inicio" ? (
            <button
              type="button"
              className={estilos.otroMetodo}
              onClick={() => setPaso("correo")}
            >
              No uso Gmail: entrar con mi correo
            </button>
          ) : (
            <form onSubmit={pedirCodigo} className={estilos.form}>
              <div className="campo">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  ref={correoRef}
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="send"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  aria-errormessage="correo-error"
                />
                <span className="error" id="correo-error">
                  Escribe un correo válido.
                </span>
              </div>
              <button
                type="submit"
                className="boton boton-principal"
                disabled={!!cargando}
              >
                {cargando === "correo" ? "Enviando…" : "Enviarme un código"}
              </button>
              <p className="pista">
                Te llega un código de 6 números. No necesitas contraseña.
              </p>
            </form>
          )}
        </>
      ) : (
        <form onSubmit={verificar} className={estilos.form}>
          <p>
            Enviamos un código a <strong>{correo}</strong>. Revisa también la
            carpeta de spam.
          </p>
          <div className="campo">
            <label htmlFor="codigo">Código de 6 números</label>
            <input
              ref={codigoRef}
              id="codigo"
              name="codigo"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              enterKeyHint="done"
              className={estilos.codigo}
              aria-errormessage="codigo-error"
            />
            <span className="error" id="codigo-error">
              Son 6 números.
            </span>
          </div>
          <button
            type="submit"
            className="boton boton-principal"
            disabled={!!cargando}
          >
            {cargando === "codigo" ? "Entrando…" : "Entrar"}
          </button>
          <button
            type="button"
            className={estilos.enlace}
            onClick={() => {
              setPaso("correo");
              setError("");
            }}
          >
            Usar otro correo o pedir un código nuevo
          </button>
        </form>
      )}
      {error && (
        <p className={estilos.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
