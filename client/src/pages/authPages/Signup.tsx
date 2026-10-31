import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { useSignup } from "@/hooks/user";
import { Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateUser, createUserSchema } from "@/schema/userSchema";

function Signup() {
	const { mutate, isPending } = useSignup();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<CreateUser>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
		},
	});
	const onSubmit: SubmitHandler<CreateUser> = (data) => mutate(data);
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
					<h2 className="text-h2 text-text-primary">Create your account</h2>
					<p className="text-body-sm text-text-secondary">
						Add your accounts, upload a statement, and see where your money
						goes.
					</p>
				</div>
				<Input
					type={"text"}
					label="Full Name"
					{...register("fullName")}
					error={errors.fullName?.message}
					autoComplete="fullName"
				/>
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
				<Input
					type={"password"}
					label="Confirm Password"
					{...register("confirmPassword")}
					error={errors.confirmPassword?.message}
				/>
				<Button type="submit" disabled={isPending}>
					{isPending ? "Logging in…" : "Signup"}
				</Button>
				<p className="text-body-sm text-text-secondary">
					Already have an account?{" "}
					<Link to={"/login"} className="text-label-lg text-text-link">
						Sign in
					</Link>
				</p>
			</form>
		</div>
	);
}

export default Signup;
