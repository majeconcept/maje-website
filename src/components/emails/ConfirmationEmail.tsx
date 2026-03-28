import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
} from "@react-email/components";

interface ConfirmationEmailProps {
  firstName: string;
}

export function ConfirmationEmail({ firstName }: ConfirmationEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Body
        style={{
          backgroundColor: "#0A0A0F",
          fontFamily: "system-ui, -apple-system, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}
        >
          <Heading
            style={{
              color: "#C9A84C",
              fontSize: "22px",
              fontWeight: "600",
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            Maje Concept
          </Heading>
          <Text
            style={{
              color: "#8A8A8A",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: "0 0 40px",
            }}
          >
            Print &amp; Marquage Textile en Alsace
          </Text>

          <Text
            style={{
              color: "#F5F5F0",
              fontSize: "16px",
              lineHeight: "1.7",
              margin: "0 0 16px",
            }}
          >
            Bonjour {firstName},
          </Text>
          <Text
            style={{
              color: "#F5F5F0",
              fontSize: "16px",
              lineHeight: "1.7",
              margin: "0 0 16px",
            }}
          >
            Votre demande de devis a bien été reçue. Notre équipe l&apos;examinera
            dans les meilleurs délais et vous contactera sous{" "}
            <strong style={{ color: "#C9A84C" }}>24 heures ouvrées</strong>.
          </Text>
          <Text
            style={{
              color: "#A0A0A0",
              fontSize: "15px",
              lineHeight: "1.7",
              margin: "0 0 32px",
            }}
          >
            En attendant, n&apos;hésitez pas à consulter nos réalisations sur notre
            site.
          </Text>

          <Hr style={{ borderColor: "rgba(201,168,76,0.2)", margin: "32px 0" }} />

          <Section>
            <Text
              style={{
                color: "#707070",
                fontSize: "13px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              Maje Concept
              <br />
              10 Rue du Maréchal Foch, 68000 Colmar
              <br />
              <Link
                href="tel:+33389XXXXXX"
                style={{ color: "#C9A84C", textDecoration: "none" }}
              >
                +33 3 89 XX XX XX
              </Link>
              {" — "}
              <Link
                href="https://maje-concept.fr"
                style={{ color: "#C9A84C", textDecoration: "none" }}
              >
                maje-concept.fr
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
