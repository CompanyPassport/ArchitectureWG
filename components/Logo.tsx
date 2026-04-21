import Image from "next/image";

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Image
        src="/logo.png"
        alt="Company Passport logo"
        width={32}
        height={32}
        priority
      />
      <span style={{ fontWeight: 600, fontSize: "16px" }}>
        Company Passport
      </span>
    </div>
  );
}
