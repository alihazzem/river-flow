import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RegisterFormState } from "@/types";
import type { LoginFormState } from "@/types";

export const useRegisterFormStore = create<RegisterFormState>()(
    persist(
        (set) => ({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            setField: (field, value) => set({ [field]: value }),
            reset: () =>
                set({ firstname: '', lastname: '', email: '', password: '' }),
        }),
        { name: 'register-form' }
    )
)

export const useLoginFormStore = create<LoginFormState>()(
    persist(
        (set) => ({
            email: "",
            password: "",
            setField: (field, value) => set({ [field]: value }),
            reset: () => set({ email: "", password: "" }),
        }),
        { name: "login-form" }
    )
);

