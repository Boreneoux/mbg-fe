# POS App Reference for Next Project

This document summarizes the current `pos-app` architecture and reusable coding patterns.

## 1) Folder Structure (pos-app)

```txt
pos-app/
  docker-compose.yml
  Dockerfile
  eslint.config.mjs
  next-env.d.ts
  next.config.ts
  package.json
  postcss.config.mjs
  README.md
  tsconfig.json
  public/
  src/
    app/
      account-activation/
        [slug]/
          page.tsx
      cashier/
        layout.tsx
        page.tsx
      components/
        CashierHeader.tsx
        DashboardHeader.tsx
        SideBar.tsx
      dashboard/
        menus-management/
          create/
            page.tsx
          page.tsx
        layout.tsx
        page.tsx
      favicon.ico
      globals.css
      layout.tsx
      page.tsx
    features/
      login/
        api/
          login.api.ts
          session.api.ts
        hooks/
          useFormLogin.ts
        schemas/
          loginValidationSchema.ts
        types.ts
      menus-management/
        schemas/
          createMenuValidationSchema.ts
    hoc/
      useAuthGuard.tsx
    providers/
      AuthProvider.tsx
    stores/
      useAuthStore.ts
    types/
      api.ts
    utils/
      axiosInstance.ts
```

## 2) Unique Code Style and Architecture

### A. Vertical Feature + Shared Core
- Feature code is grouped by domain in `src/features/<feature-name>`.
- Shared cross-feature utilities are in:
  - `src/utils` for API/utility instances
  - `src/stores` for global state (Zustand)
  - `src/types` for generic response types
  - `src/providers` for app-wide bootstrapping (session auth)
  - `src/hoc` for route/component guards

### B. API Access Pattern
- Use one centralized Axios client from `src/utils/axiosInstance.ts`.
- Every API function lives in feature-level `api/` folders.
- API functions generally:
  1. call endpoint,
  2. return `response.data.data`,
  3. throw backend response on error.

### C. Auth Pattern
- Session bootstrap in root provider (`AuthProvider`) and mounted in app layout.
- Auth state is global via Zustand (`useAuthStore`), keeping `username` and `role`.
- Access control is wrapped by `useAuthGuard` HOC with `allowedRoles`.

### D. Form Pattern
- Use Formik hooks in feature-level hooks (`useFormLogin`).
- Validation schema separated in feature `schemas/` (Yup).
- UI page imports a feature hook and binds `formik.handleChange`, `formik.handleSubmit`, `formik.errors`.

### E. Naming Convention Pattern
- API files: `<action>.api.ts` (example: `login.api.ts`, `session.api.ts`)
- Hooks: `use<FormName>.ts` (example: `useFormLogin.ts`)
- Store hooks: `use<Domain>Store.ts`
- Validation schema: `<action>ValidationSchema.ts`
- Generic API types: `src/types/api.ts`

## 3) Reusable Custom Functions for Next Project

Use these as starter templates in your next project.

### 3.1 Axios Instance (shared API client)

```ts
// src/utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default axiosInstance;
```

### 3.2 Generic API Response Type

```ts
// src/types/api.ts
export type ApiResponse<T> = {
  message: string;
  data: T;
};
```

### 3.3 Auth Store (Zustand)

```ts
// src/stores/useAuthStore.ts
import { create } from 'zustand';

type UseAuthStore = {
  username: string;
  role: string;
  setAuth: ({ username, role }: { username: string; role: string }) => void;
};

const useAuthStore = create<UseAuthStore>((set) => ({
  username: '',
  role: '',
  setAuth: ({ username, role }) => {
    set({ username, role });
  },
}));

export default useAuthStore;
```

### 3.4 Session Bootstrap Provider

```tsx
// src/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { sessionApi } from '@/features/login/api/session.api';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const { setAuth } = useAuthStore();

  const onSessionAuth = async () => {
    const user = await sessionApi();

    if (user) {
      setAuth({
        username: user.username,
        role: user.role,
      });
    }
  };

  useEffect(() => {
    onSessionAuth();
  }, []);

  return <>{children}</>;
}
```

### 3.5 Login API Function

```ts
// src/features/login/api/login.api.ts
import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { User } from '@/features/login/types';

export async function loginApi({
  email,
  password,
}: Pick<User, 'email' | 'password'>) {
  try {
    const response = await axiosInstance.post<ApiResponse<User>>('/auth/login', {
      email,
      password,
    });

    return response.data.data;
  } catch (error: any) {
    throw error?.response;
  }
}
```

### 3.6 Session API Function

```ts
// src/features/login/api/session.api.ts
import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { User } from '@/features/login/types';

export async function sessionApi() {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/session');
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
```

### 3.7 Auth Guard HOC

```tsx
// src/hoc/useAuthGuard.tsx
'use client';

import { ComponentType } from 'react';
import useAuthStore from '@/stores/useAuthStore';

export default function useAuthGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[],
) {
  return function AuthGuardComponent(props: P) {
    const { role } = useAuthStore();
    const isAuthorized = allowedRoles.includes(role);

    if (!isAuthorized) {
      return <h1 className='font-bold text-2xl'>User role unauthorized to open this page</h1>;
    }

    return <WrappedComponent {...props} />;
  };
}
```

### 3.8 Formik Login Hook Pattern

```ts
// src/features/login/hooks/useFormLogin.ts
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import useAuthStore from '@/stores/useAuthStore';
import { loginApi } from '../api/login.api';

export function useFormLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ email, password }) => {
      try {
        const user = await loginApi({ email, password });

        setAuth({ username: user?.username, role: user?.role });
        router.push('/dashboard');
      } catch (error: any) {
        alert(error?.data?.message);
      }
    },
  });

  return { formik };
}
```

### 3.9 File Upload + Yup Schema Pattern (Menu)

```ts
// src/features/menus-management/schemas/createMenuValidationSchema.ts
import * as yup from 'yup';

export const createMenuValidationSchema = yup.object().shape({
  name: yup.string().required('Menu name is required'),
  price: yup.number().required('Menu price is required').min(1).max(999999999),
  description: yup.string().required('Menu description is required'),
  isAvailable: yup.boolean().required('Menu available is required'),
  images: yup.array().of(
    yup
      .mixed<File>()
      .test('fileSize', 'Maximum file size is 2mb', (file) => {
        if (!file) return true;
        const maximumSize = 2 * 1024 * 1024;
        return file.size < maximumSize;
      })
      .test('fileFormat', 'File format not accepted', (file) => {
        if (!file) return true;
        const splittedFileName = file.name?.split('.');
        const fileExtension = splittedFileName[splittedFileName.length - 1];
        const acceptedFileFormat = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
        return acceptedFileFormat.includes(fileExtension);
      }),
  ),
});
```

## 4) Recommended Baseline for Next Project

1. Keep this same folder strategy: `features/` for domain logic, `utils/stores/types/providers/hoc` for shared core.
2. Keep API calls isolated in `features/<domain>/api`.
3. Keep Formik + Yup hooks in `features/<domain>/hooks` and `schemas`.
4. Keep auth bootstrapping in one provider mounted in root layout.
5. Keep reusable global types (`ApiResponse<T>`) centralized.

## 5) Notes

- `src/features/login/schemas/loginValidationSchema.ts` currently exists but is empty.
- In current source, there are mixed quote and indentation styles. For future projects, enforce Prettier + ESLint auto-format for consistency.
