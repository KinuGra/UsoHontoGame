"use client";

// useGameForm Hook
// Feature: 002-game-preparation
// Custom hook for game creation form with Zod validation

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateGameSchema } from "@/server/domain/schemas/gameSchemas";
import { createGameAction } from "@/app/actions/game";
import type { CreateGameOutput } from "@/server/application/dto/GameDto";

interface UseGameFormReturn {
	/** Form submission handler */
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	/** Whether form is currently submitting */
	isSubmitting: boolean;
	/** Validation errors by field */
	errors: Record<string, string[]>;
	/** Created game data on success */
	createdGame: CreateGameOutput | null;
	/** Whether creation was successful */
	isSuccess: boolean;
}

/**
 * Custom hook for game creation form
 * Handles form validation, submission, and error display
 * @returns Form state and handlers
 */
export function useGameForm(): UseGameFormReturn {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [createdGame, setCreatedGame] = useState<CreateGameOutput | null>(
		null,
	);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		setIsSuccess(false);

		const formData = new FormData(e.currentTarget);

		// Client-side validation with Zod
		const rawData = {
			playerLimit: Number(formData.get("playerLimit")),
		};

		const validationResult = CreateGameSchema.safeParse(rawData);

		if (!validationResult.success) {
			setErrors(validationResult.error.flatten().fieldErrors);
			return;
		}

		// Server action call with transition
		startTransition(async () => {
			try {
				const result = await createGameAction(formData);

				if (result.success) {
					setCreatedGame(result.game);
					setIsSuccess(true);
					// Redirect to TOP page after short delay
					setTimeout(() => {
						router.push("/top");
					}, 1500);
				} else {
					setErrors(result.errors);
				}
			} catch (error) {
				console.error("Form submission error:", error);
				setErrors({
					_form: ["予期しないエラーが発生しました"],
				});
			}
		});
	};

	return {
		handleSubmit,
		isSubmitting: isPending,
		errors,
		createdGame,
		isSuccess,
	};
}
