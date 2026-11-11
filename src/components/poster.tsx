import { headers } from "next/headers";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { BrandMark, Icon, brandStyle } from "@/components/ui";
import type { Business } from "@/db/schema";
import { qrSvg } from "@/lib/qr";

/** Cartel imprimible con el código de alta del negocio. */
export async function Poster({ business, backHref }: { business: Business; backHref: string }) {
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const qr = await qrSvg(`${origin}/j/${business.slug}`);

  return (
    <div style={brandStyle(business.color)} className="flex flex-1 flex-col px-4 pb-32 pt-6 lg:p-0">
      <div className="no-print mb-6 flex items-center justify-between gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone transition-colors hover:text-ink"
        >
          <Icon name="back" size={16} /> {business.name}
        </Link>
        <PrintButton />
      </div>

      {/* El cartel siempre es claro: está pensado para imprimirse */}
      <div className="card mx-auto w-full max-w-md !p-8 text-center print:max-w-none print:shadow-none">
<span className="inline-flex [print-color-adjust:exact]">
          <BrandMark icon={business.icon} size={64} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold">{business.name}</p>
        <h1 className="mt-3 text-4xl font-medium leading-[1.05] text-balance">
          Junta {business.stampsRequired} sellos y llévate <span className="em">{business.rewardText}</span>
        </h1>
        <div
          role="img"
          aria-label="Código QR de alta"
          className="mx-auto mt-7 w-64 rounded-2xl p-4 shadow-[0_0_0_1px_rgb(10_11_13/0.1)] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qr }}
        />
        <ol className="mx-auto mt-7 max-w-xs space-y-2 text-left text-sm text-stone">
          <li>
            <b className="text-ink">1.</b> Escanea el código con la cámara de tu celular.
          </li>
          <li>
            <b className="text-ink">2.</b> Escribe tu nombre y tu número.
          </li>
          <li>
            <b className="text-ink">3.</b> Muestra tu tarjeta en caja en cada visita.
          </li>
        </ol>
      </div>
    </div>
  );
}
