import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="PT. Maju Jaya Sukses" description="Sistem Informasi Manajemen Sumber Daya">
            <Head title="Log in" />

            <div className="border-border bg-card w-full max-w-sm overflow-hidden rounded-xl border">
                {/* Header */}
                <div className="border-border border-b px-8 pt-7 pb-6">
                    <div className="bg-foreground mb-5 flex h-9 w-9 items-center justify-center rounded-lg">
                        <svg className="text-background h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1 className="text-foreground text-[17px] font-medium">Welcome back</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Sign in to your account to continue</p>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="flex flex-col gap-4 px-8 py-6">
                    {status && (
                        <div className="rounded-md bg-green-50 px-4 py-2.5 text-center text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-muted-foreground text-xs font-medium">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="bg-muted/50"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-muted-foreground text-xs font-medium">
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-muted-foreground hover:text-foreground text-xs underline-offset-2"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="password"
                            className="bg-muted/50"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <Button type="submit" className="mt-1 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Sign in
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
