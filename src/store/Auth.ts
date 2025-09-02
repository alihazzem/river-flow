import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID } from "appwrite";
import { account } from "@/models/client/config";
import type { IAuthStore, UserPrefs } from "@/types";
import { registerSchema, loginSchema } from "@/lib/zod/auth";
import { z } from "zod";


const defaultState = {
    session: null,
    user: null,
    hydrated: false,
};

export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            ...defaultState,

            setHydrated() {
                set({ hydrated: true });
            },

            async verifySession() {
                try {
                    const session = await account.getSession({
                        sessionId: "current"
                    });
                    set({ session });
                    return { success: true };
                } catch (error) {
                    set({ session: null, user: null });
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null
                    };
                }
            },

            async login(email: string, password: string) {
                const parsed = loginSchema.safeParse({ email, password });
                if (!parsed.success) {
                    const formattedError = z.treeifyError(parsed.error);
                    return { success: false, validationError: formattedError };
                }
                try {
                    const session = await account.createEmailPasswordSession({
                        email,
                        password
                    });
                    const [user] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ]);
                    if (!user.prefs?.reputation) {
                        await account.updatePrefs<UserPrefs>({
                            prefs: { reputation: 0 }
                        })
                    }
                    set({ session, user });
                    return { success: true };
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null
                    };
                }
            },

            async register(email: string, password: string, name: string) {
                const parsed = registerSchema.safeParse({ email, password, name });
                if (!parsed.success) {
                    const formattedError = z.treeifyError(parsed.error);
                    return { success: false, validationError: formattedError };
                }
                try {
                    await account.create({
                        userId: ID.unique(),
                        email,
                        password,
                        name
                    });
                    return { success: true };
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null
                    };
                }
            },

            async logout() {
                try {
                    await account.deleteSessions();
                    set({ ...defaultState });
                } catch (error) {
                    console.error("Error logging out:", error);
                }
            }
        })),
        {
            name: "auth",
            partialize: (state) => ({
                session: state.session,
                user: {
                    name: state.user?.name,
                    email: state.user?.email,
                    reputation: state.user?.prefs?.reputation
                }
            }),
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) state?.setHydrated();
                };
            }
        }
    )
);