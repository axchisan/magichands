"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

// Cliente del login para componentes de navegador. Usa el mismo origen de la página (portable).
export const authCliente = createAuthClient({ plugins: [emailOTPClient()] });
