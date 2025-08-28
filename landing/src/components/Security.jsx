import SecurityAnimated from "./SecurityAnimated";

const certifications = [
  "ISO 27001",
  "SOC 2 Type II",
  "RGPD",
  "Bâle III",
  "PCI DSS",
  "ACPR"
];

export default function Security() {
  return <SecurityAnimated certifications={certifications} />;
}