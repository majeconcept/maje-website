import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import type { ContactFormData } from "@/lib/validations";

interface NotificationEmailProps {
  data: ContactFormData;
}

const NEED_LABELS: Record<string, string> = {
  serigraphie: "Sérigraphie",
  broderie: "Broderie",
  dtf: "DTF",
  flocage: "Flocage",
  transfert: "Transfert",
  "marquage-textile": "Marquage Textile",
  autre: "Autre",
};

export function NotificationEmail({ data }: NotificationEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Body
        style={{
          backgroundColor: "#0F0F14",
          fontFamily: "system-ui, -apple-system, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}
        >
          <Heading
            style={{ color: "#C9A84C", fontSize: "20px", margin: "0 0 4px" }}
          >
            Nouvelle demande de devis
          </Heading>
          <Text
            style={{
              color: "#707070",
              fontSize: "12px",
              letterSpacing: "0.1em",
              margin: "0 0 32px",
            }}
          >
            Site maje-concept.fr —{" "}
            {new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>

          <Hr
            style={{ borderColor: "rgba(201,168,76,0.2)", margin: "0 0 24px" }}
          />

          {/* Contact info */}
          <Section style={{ marginBottom: "24px" }}>
            <Row>
              <Column>
                <Text
                  style={{
                    color: "#8A8A8A",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    margin: "0 0 4px",
                  }}
                >
                  Contact
                </Text>
                <Text
                  style={{
                    color: "#F5F5F0",
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: "0 0 4px",
                  }}
                >
                  {data.firstName} {data.lastName}
                </Text>
                {data.company && (
                  <Text
                    style={{
                      color: "#A0A0A0",
                      fontSize: "14px",
                      margin: "0 0 4px",
                    }}
                  >
                    {data.company}
                  </Text>
                )}
              </Column>
            </Row>
          </Section>

          {/* Details grid */}
          <Section
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <Row style={{ marginBottom: "12px" }}>
              <Column style={{ width: "40%" }}>
                <Text
                  style={{
                    color: "#8A8A8A",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Email
                </Text>
                <Text
                  style={{
                    color: "#F5F5F0",
                    fontSize: "14px",
                    margin: "4px 0 0",
                  }}
                >
                  {data.email}
                </Text>
              </Column>
              <Column style={{ width: "60%" }}>
                <Text
                  style={{
                    color: "#8A8A8A",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Téléphone
                </Text>
                <Text
                  style={{
                    color: "#F5F5F0",
                    fontSize: "14px",
                    margin: "4px 0 0",
                  }}
                >
                  {data.phone || "Non renseigné"}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text
                  style={{
                    color: "#8A8A8A",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Type de besoin
                </Text>
                <Text
                  style={{
                    color: "#C9A84C",
                    fontSize: "14px",
                    fontWeight: "600",
                    margin: "4px 0 0",
                  }}
                >
                  {NEED_LABELS[data.needType] ?? data.needType}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Message */}
          <Section style={{ marginBottom: "24px" }}>
            <Text
              style={{
                color: "#8A8A8A",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: "0 0 8px",
              }}
            >
              Message
            </Text>
            <Text
              style={{
                color: "#E0E0E0",
                fontSize: "15px",
                lineHeight: "1.7",
                backgroundColor: "rgba(255,255,255,0.03)",
                padding: "16px",
                margin: 0,
              }}
            >
              {data.message}
            </Text>
          </Section>

          {/* Configurator summary if present */}
          {data.configuratorSummary && (
            <Section style={{ marginBottom: "24px" }}>
              <Text
                style={{
                  color: "#8A8A8A",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                }}
              >
                Configuration produit
              </Text>
              <Text
                style={{
                  color: "#C9A84C",
                  fontSize: "14px",
                  backgroundColor: "rgba(201,168,76,0.08)",
                  padding: "12px 16px",
                  borderLeft: "3px solid #C9A84C",
                  margin: 0,
                }}
              >
                {data.configuratorSummary}
              </Text>
            </Section>
          )}

          <Hr
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              margin: "24px 0 16px",
            }}
          />
          <Text style={{ color: "#505050", fontSize: "12px", margin: 0 }}>
            Ce message a été envoyé depuis le formulaire de contact de
            maje-concept.fr
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
