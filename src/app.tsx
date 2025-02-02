import { LocationProvider, Route, Router } from "preact-iso";
import Search from "./pages/search";
import FilterSearch from "./pages/filtersearch";

export function App() {
	return (
		<LocationProvider>
			<Router>
				{/* Both of these are equivalent */}
				{/* <Home path="/" />
			<Route path="/" component={Home} />

			<Profile path="/profile" /> */}
				{/* <Route component={() => "404 Not Found"} /> */}
				<Route path="/search" component={Search} />
				<Route default component={FilterSearch} />
			</Router>
		</LocationProvider>
	);
}
