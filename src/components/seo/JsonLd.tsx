import Script from 'next/script';

interface JsonLdProps {
  id: string;
  schema: object | object[];
}

/**
 * Generic JSON-LD Schema component
 * Use this to add structured data to any page
 */
export function JsonLd({ id, schema }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

/**
 * Multiple schemas in one script tag
 */
export function JsonLdMultiple({ id, schemas }: { id: string; schemas: object[] }) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas),
      }}
    />
  );
}

export default JsonLd;
