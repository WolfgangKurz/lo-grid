import { render, h, Fragment } from "preact";

import App from "@/components/app";

import "bootstrap/scss/bootstrap.scss";
// import "bootstrap";

import "@/themes/index.scss";

render(h(App, {}), document.getElementById("page")!);
