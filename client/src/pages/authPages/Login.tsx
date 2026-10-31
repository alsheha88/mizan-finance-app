import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { useLogin } from "@/hooks/user";
import { Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginUser } from "@/schema/userSchema";

function Login() {
	const { mutate, isPending } = useLogin();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<LoginUser>({
		resolver: zodResolver(loginSchema),
	});
	const onSubmit: SubmitHandler<LoginUser> = (data) => mutate(data);
	return (
		<div className="flex py-8 px-5 items-center justify-center bg-bg-primary h-dvh ">
			<form
				noValidate
				onSubmit={handleSubmit(onSubmit)}
				className="grid gap-6 sm:p-8 p-4 bg-card-default border border-border-subtle rounded-xl max-w-[90%] w-[clamp(w-sm, w-lg ,95%)] ">
				<div className="flex items-center gap-3">
					<div className="p-2 flex items-center justify-center rounded-xs bg-interactive-primary">
						<Scale className="stroke-interactive-primary-foreground" />
					</div>
					<h3 className="text-h3 text-text-primary">Mizan</h3>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-h2 text-text-primary">Welcome back</h2>
					<p className="text-body-sm text-text-secondary">
						Sign in to see this month's income, expenses and balances.
					</p>
				</div>
				<Input
					type={"email"}
					label="Email"
					{...register("email")}
					error={errors.email?.message}
					autoComplete="email"
				/>
				<Input
					type={"password"}
					label="Password"
					{...register("password")}
					error={errors.password?.message}
					autoComplete="current-password"
				/>
				<Button type="submit" disabled={isPending}>
					{isPending ? "Signing in…" : "Sign In"}
				</Button>
				<p className="text-body-sm text-text-secondary">
					New here?{" "}
					<Link to={"/signup"} className="text-label-lg text-text-link">
						Create an account
					</Link>
				</p>
			</form>
		</div>
	);
}

export default Login;
