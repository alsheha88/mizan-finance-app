import { useState, type SetStateAction } from "react";

import { Sidebar } from "./components/primitives/Sidebar";

function App() {
	const [isOpen, setIsOpen] = useState(false);
	function handleClick() {
		setIsOpen(true);
	}
	return (
		<div className="bg-bg-primary flex min-h-dvh gap-4">
				<Sidebar />
				<main className="flex-1 px-6 pt-6 pb-20 ">
					
				</main>
		</div>
	);
}

export default App;
