"use client";

// GameForm Component
// Feature: 002-game-preparation
// Form for creating new games with player limit validation

import { useGameForm } from "@/hooks/useGameForm";

/**
 * GameForm Component
 * Displays form for creating new games with player limit input
 * Handles validation, submission, and error display
 */
export function GameForm() {
	const { handleSubmit, isSubmitting, errors, isSuccess } = useGameForm();

	return (
		<div className="max-w-md mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">新しいゲームを作成</h1>

			{isSuccess && (
				<div
					className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md"
					role="alert"
				>
					<p className="text-green-800">
						ゲームを作成しました！TOPページにリダイレクトしています...
					</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Player Limit Input */}
				<div>
					<label
						htmlFor="playerLimit"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						プレイヤー数上限 (1-100)
					</label>
					<input
						type="number"
						id="playerLimit"
						name="playerLimit"
						min="1"
						max="100"
						defaultValue="10"
						required
						disabled={isSubmitting || isSuccess}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
						aria-describedby={
							errors.playerLimit ? "playerLimit-error" : undefined
						}
						aria-invalid={errors.playerLimit ? "true" : "false"}
					/>
					{errors.playerLimit && (
						<p
							id="playerLimit-error"
							className="mt-1 text-sm text-red-600"
							role="alert"
						>
							{errors.playerLimit[0]}
						</p>
					)}
				</div>

				{/* Form-level errors */}
				{errors._form && (
					<div
						className="p-4 bg-red-50 border border-red-200 rounded-md"
						role="alert"
					>
						<p className="text-sm text-red-800">{errors._form[0]}</p>
					</div>
				)}

				{/* Submit Button */}
				<div className="flex gap-4">
					<button
						type="submit"
						disabled={isSubmitting || isSuccess}
						className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? "作成中..." : "ゲームを作成"}
					</button>

					<a
						href="/top"
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
					>
						キャンセル
					</a>
				</div>
			</form>

			{/* Help Text */}
			<div className="mt-6 text-sm text-gray-600">
				<p>
					作成されたゲームは「準備中」ステータスで開始されます。プレゼンターを追加してエピソードを登録後、「出題中」に変更できます。
				</p>
			</div>
		</div>
	);
}
