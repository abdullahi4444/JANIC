'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { motion } from 'framer-motion';

import {
	AppleIcon,
	AtSignIcon,
	ChevronLeftIcon,
	Loader2,
	AlertCircle,
	CheckCircle2,
	User,
	UserPlus,
	Lock,
} from 'lucide-react';
import { Input } from './input';

export function AuthPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(data.error || 'Registration failed.');
			}

			setSuccess(true);
			setTimeout(() => router.push('/admin/login'), 2000);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error creating account.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
			<main className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-blue-900/5 lg:grid lg:grid-cols-2">
				<div className="bg-[#F8FBFF] dark:bg-slate-950 relative hidden h-full flex-col border-r border-slate-100 dark:border-slate-800 p-10 lg:flex">
					<div className="z-10 flex items-center gap-3">
						<div className="relative h-10 w-36">
							<Image
								src="/images/janic-logo-blue.png"
								alt="JANIC — Jazeera Nexus Innovation Center"
								fill
								className="object-contain object-left dark:hidden"
								priority
								sizes="144px"
							/>
							<Image
								src="/images/janic-logo-white.png"
								alt="JANIC — Jazeera Nexus Innovation Center"
								fill
								className="object-contain object-left hidden dark:block"
								priority
								sizes="144px"
							/>
						</div>
					</div>
					<div className="z-10 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-xl text-slate-700 dark:text-slate-200">
								&ldquo;JANIC connected our education with real innovation and helped
								us ship faster.&rdquo;
							</p>
							<footer className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
								~ Ali Hassan
							</footer>
						</blockquote>
					</div>
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
				<div className="relative flex flex-col justify-center p-6 sm:p-10 lg:min-h-[640px]">
					<Button variant="ghost" className="absolute top-5 left-5 transition-colors duration-150" asChild>
						<Link href="/">
							<ChevronLeftIcon className="size-4 me-2" />
							Home
						</Link>
					</Button>
					<div className="mx-auto w-full max-w-sm space-y-4 pt-10 lg:pt-0">
						<div className="flex items-center gap-2 lg:hidden">
							<div className="relative h-8 w-28">
								<Image
									src="/images/janic-logo-blue.png"
									alt="JANIC logo"
									fill
									className="object-contain object-left dark:hidden"
									priority
									sizes="112px"
								/>
								<Image
									src="/images/janic-logo-white.png"
									alt="JANIC logo"
									fill
									className="object-contain object-left hidden dark:block"
									priority
									sizes="112px"
								/>
							</div>
						</div>
						<div className="flex flex-col space-y-1">
							<h1 className="font-heading text-2xl font-bold tracking-wide text-[#08245C] dark:text-white">
								Sign In or Join Now!
							</h1>
							<p className="text-muted-foreground text-base">
								Log in or create your JANIC account.
							</p>
						</div>
						<div className="space-y-2">
							<Button type="button" size="lg" className="w-full transition-colors duration-150">
								<GoogleIcon className="size-4 me-2" />
								Continue with Google
							</Button>
							<Button type="button" size="lg" className="w-full transition-colors duration-150">
								<AppleIcon className="size-4 me-2" />
								Continue with Apple
							</Button>
							<Button type="button" size="lg" className="w-full transition-colors duration-150">
								<GithubIcon className="size-4 me-2" />
								Continue with GitHub
							</Button>
						</div>

						<AuthSeparator />

						{success ? (
							<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-2">
								<CheckCircle2 className="mx-auto size-6 text-emerald-600" />
								<p className="font-semibold text-emerald-900">Welcome to JANIC!</p>
								<p className="text-sm text-emerald-700">Your account has been created. Redirecting to sign in...</p>
							</div>
						) : (
							<form className="space-y-2" onSubmit={handleSubmit}>
								{error && (
									<div role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
										<AlertCircle className="size-4 mt-0.5 shrink-0" />
										<span>{error}</span>
									</div>
								)}
								<p className="text-muted-foreground text-start text-xs">
									Enter your details to create your account
								</p>
								<div className="relative h-max">
									<Input
										placeholder="Your full name"
										aria-label="Full name"
										className="peer ps-9"
										type="text"
										required
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<User className="size-4" aria-hidden="true" />
									</div>
								</div>
								<div className="relative h-max">
									<Input
										placeholder="Choose a username"
										aria-label="Username"
										className="peer ps-9"
										type="text"
										required
										value={formData.username}
										onChange={(e) => setFormData({ ...formData, username: e.target.value })}
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<UserPlus className="size-4" aria-hidden="true" />
									</div>
								</div>
								<div className="relative h-max">
									<Input
										placeholder="your.email@example.com"
										aria-label="Email address"
										className="peer ps-9"
										type="email"
										required
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<AtSignIcon className="size-4" aria-hidden="true" />
									</div>
								</div>
								<div className="relative h-max">
									<Input
										placeholder="At least 6 characters"
										aria-label="Password"
										className="peer ps-9"
										type="password"
										required
										minLength={6}
										value={formData.password}
										onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<Lock className="size-4" aria-hidden="true" />
									</div>
								</div>

								<Button type="submit" className="w-full transition-colors duration-150" disabled={loading}>
									{loading ? (
										<>
											<Loader2 className="size-4 me-2 animate-spin" />
											Creating Account...
										</>
									) : (
										<span>Create Account</span>
									)}
								</Button>
							</form>
						)}
						<p className="text-muted-foreground mt-8 text-sm">
							By clicking continue, you agree to our{' '}
							<Link
								href="#"
								className="hover:text-primary underline underline-offset-4 transition-colors duration-150"
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<Link
								href="#"
								className="hover:text-primary underline underline-offset-4 transition-colors duration-150"
							>
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
			</main>
		</section>
	);
}

const FloatingPaths = React.memo(function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		width: 0.5 + i * 0.03,
		duration: 20 + (i % 5) * 2,
		delay: -(i * 0.4),
	}));

	return (
		<div className="pointer-events-none absolute inset-0" aria-hidden="true">
			<svg
				className="h-full w-full text-[#0875D1]"
				viewBox="0 0 696 600"
				preserveAspectRatio="xMidYMid slice"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.008}
						initial={{ pathLength: 0.3, pathOffset: 0 }}
						animate={{
							pathLength: 1,
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: path.duration,
							delay: path.delay,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
});

const GithubIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.05.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
	</svg>
);

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const AuthSeparator = () => {
	return (
		<div className="flex w-full items-center justify-center">
			<div className="bg-border h-px w-full" />
			<span className="text-muted-foreground px-2 text-xs">OR</span>
			<div className="bg-border h-px w-full" />
		</div>
	);
};
