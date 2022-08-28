import { FunctionalComponent } from "preact";
import { Router } from "preact-router";
import AsyncRoute from "preact-async-route";

// import AIList from "@/components/ai-list/new.index";

const App: FunctionalComponent = () => {
	if (typeof window !== "undefined") {
		const pageonloading = document.querySelector("#pageonloading");
		if (pageonloading) {
			const parent = pageonloading.parentNode;
			if (parent)
				parent.removeChild(pageonloading);
		}
	}

	const pRoute = (component: () => Promise<any>): Partial<AsyncRoute["props"]> => ({
		loading: () => <span class="text-secondary">Loading page</span>,
		getComponent: () => component().then(x => x.default),
	});

	return <div id="app">
		<div class="container p-4">
			<Router>
				<AsyncRoute default path="/:p1?/:p2?" { ...pRoute(() => import("@/routes/home")) } />
			</Router>
		</div>
	</div>;
};
export default App;
