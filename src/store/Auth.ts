import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID } from "appwrite";
import { account } from "@/models/client/config";
import type { IAuthStore, UserPrefs } from "@/types";

const defaultState = {
    session: null,
    jwt: null,
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
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null
                    };
                }
            },

            async login(email: string, password: string) {
                try {
                    const session = await account.createEmailPasswordSession({
                        email,
                        password
                    });
                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ]);
                    if (!user.prefs?.reputation) {
                        await account.updatePrefs<UserPrefs>({
                            prefs: { reputation: 0 }
                        })
                    }
                    set({ session, jwt, user });
                    return { success: true };
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null
                    };
                }
            },

            async register(email: string, password: string, name: string) {
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
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) state?.setHydrated();
                };
            }
        }
    )
);