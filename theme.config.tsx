import type { DocsThemeConfig } from "nextra-theme-docs";
import { Logo } from "./components/Logo";
import { Footer } from "./components/Footer";
import { useRouter } from "next/router";

const basePath = "/ArchitectureWG";

const config: DocsThemeConfig = {
  logo: => <Logo />,
  footer: {
    component: <Footer />,
  },
  docsRepositoryBase:
    "https://github.com/CompanyPassport/ArchitectureWG",
  darkMode: false,
  nextThemes: {
    forcedTheme: "light",
    defaultTheme: "light",
  },
  feedback: {
    content: null,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  toc: {
    float: false,
  },
  editLink: {
    component: null,
  },
  head: null,
  primaryHue: 187,
  primarySaturation: 60,
  useNextSeoProps() {
    const { asPath } = useRouter();

    const normalizedPath =
      asPath === "/" ? basePath : `${basePath}${asPath}`;

    return {
      titleTemplate:
        asPath !== "/"
          ? "%s – Company Passport"
          : "Company Passport | Technical components, requirements and architecture for the Company Passport project",
      description:
        "This site contains the functional and technical components, requirements and architecture for the Company Passport project. You will need to support these specifications in order for your software solution to be compatible with it.",
      additionalLinkTags: [
        { rel: "icon", href: `${basePath}/favicon.ico` },
      ],
      additionalMetaTags: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "apple-mobile-web-app-title", content: "Company Passport" },
        { name: "msapplication-TileColor", content: "#fff" },
      ],
      openGraph: {
        type: "website",
        url: normalizedPath,
        images: [
          {
            url: `${basePath}/og.jpeg`,
          },
        ],
      },
      twitter: {
        cardType: "summary_large_image",
      },
    };
  },
};

export default config;
