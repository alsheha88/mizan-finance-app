import * as RadixSwitch from "radix-ui/switch";

type SwitchProps = {
	ariaLabel?: string;
	value: "dark" | "light";
	toggleTheme: () => void;
};

export function Switch({ value, toggleTheme, ariaLabel }: SwitchProps) {
	return (
		<RadixSwitch.Root
			className="bg-toggle-off data-[state=checked]:bg-toggle-on w-10.5 h-6.25 px-0.5 rounded-full focus-visible:ring-2 focus-visible:ring-ring-default transition-colors cursor-pointer relative"
			checked={value === "dark"}
			aria-label={ariaLabel}
			onCheckedChange={toggleTheme}>
			<RadixSwitch.Thumb className="block bg-toggle-thumb w-5.25 h-5.25 rounded-full  data-[state=checked]:translate-x-4.75 transition-transform" />
		</RadixSwitch.Root>
	);
}
