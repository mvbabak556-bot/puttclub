import { Stagger, StaggerItem } from "@/components/Motion";
import SiteIcon from "@/components/site/SiteIcon";
import { SITE_DEFAULTS, type FeaturesSettings } from "@/lib/site-schema";

export default function FeaturesStrip({ data = SITE_DEFAULTS.features }: { data?: FeaturesSettings }) {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group h-full rounded-3xl border border-gold-500/10 bg-forest-900 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30">
                <span className="grid size-13 place-items-center rounded-2xl border border-gold-500/25 bg-forest-800 text-gold-400 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-forest-950">
                  <SiteIcon name={f.icon} size={22} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 text-lg font-black">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-sage">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
