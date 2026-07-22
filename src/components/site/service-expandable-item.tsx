import type { Service } from '#/data/site-content'

type ServiceExpandableItemProps = {
  service: Service
}

function splitDetails(details: string): string[] {
  return details.split('\n\n').filter((part) => part.trim().length > 0)
}

export function ServiceExpandableItem({ service }: ServiceExpandableItemProps) {
  const titleId = `service-${service.id}`

  return (
    <li className="space-y-3">
      <h3 id={titleId} className="text-xl font-bold text-[#0a0a0a]">
        {service.title}
      </h3>
      <p className="text-base leading-7 text-[#525252]">{service.summary}</p>
      {service.details ? (
        <details className="group">
          <summary className="cursor-pointer text-sm font-bold text-[#1e3a8a] hover:text-[#1e40af]">
            Повече информация
          </summary>
          <div aria-labelledby={titleId} className="mt-3 space-y-3">
            {splitDetails(service.details).map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-[#525252]">
                {paragraph}
              </p>
            ))}
          </div>
        </details>
      ) : null}
    </li>
  )
}
