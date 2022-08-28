type MetaKeys = "title" | "description" | "keywords" |
	"twitter:card" | "twitter:site" | "twitter:title" | "twitter:description" | "twitter:image" |
	"og:title" | "og:type" | "og:url" | "og:image";

const meta: Partial<Record<MetaKeys, string>> = {};

const defaultMeta: Record<MetaKeys, string> = {
	title: "LO-Grid",
	description: "LastOrigin Skill Grid Maker",
	keywords: "LastOrigin,Last Origin",

	"twitter:card": "summary",
	"twitter:site": "@wolfgangkurzdev",
	"twitter:title": "LO-Grid",
	"twitter:description": "LastOrigin Skill Grid Maker",
	"twitter:image": `${window.location.origin}/icon.png`,

	"og:title": "LO-Grid",
	"og:type": "website",
	"og:url": ((): string => {
		const loc = window.location;
		return `${window.location.origin}${loc.pathname}`;
	})(),
	"og:image": `${window.location.origin}/icon.png`,
};

function updateMeta (): void {
	document.head.querySelectorAll("meta[data-meta]")
		.forEach(x => document.head.removeChild(x));

	(Object.keys(meta) as MetaKeys[])
		.forEach(x => {
			const value = meta[x];
			if (value === undefined) return;

			const tag: HTMLMetaElement = document.createElement("meta");
			tag.setAttribute("data-meta", "");

			if (x.startsWith("og:"))
				tag.setAttribute("property", x);
			else
				tag.name = x;

			tag.content = value;
			document.head.appendChild(tag);
		});
}

export function SetMeta (name: MetaKeys | MetaKeys[], value: string | null, appendToDefault: boolean = false): void {
	if (Array.isArray(name)) {
		name.forEach(x => {
			const def = defaultMeta[x];
			meta[x] = value === null ? def : (appendToDefault ? def + value : value);
		});
	} else {
		const def = defaultMeta[name];
		meta[name] = value === null ? def : (appendToDefault ? def + value : value);
	}

	updateMeta();
}

(Object.keys(defaultMeta) as MetaKeys[])
	.forEach(x => (meta[x] = defaultMeta[x]));
updateMeta();

export function UpdateTitle (...title: string[]): void {
	document.title = [
		...title.map(t => t.replace(/&#x200B;/g, "")),
		"LO-Grid",
	].join(" - ");

	SetMeta(
		["twitter:title", "og:title"],
		[
			...title.map(t => t.replace(/&#x200B;/g, "")),
			"LO-Grid",
		].join(" - "),
	);
}
