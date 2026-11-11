import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="tabular text-7xl font-semibold tracking-tight text-mist">404</p>
      <h1 className="mt-4 text-2xl font-semibold">No encontramos esta página</h1>
      <p className="mt-2 text-mist">Revisa el enlace o vuelve a escanear el código del negocio.</p>
      <Link href="/" className="btn btn-smoke mt-8">
        Ir al inicio
      </Link>
    </main>
  );
}
