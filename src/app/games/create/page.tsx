// Game Creation Page
// Feature: 002-game-preparation
// Page for creating new games at /games/create

import { GameForm } from "@/components/domain/game/GameForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "新しいゲームを作成 | ウソ？ホント？ゲーム",
	description: "プレイヤー数上限を設定して新しいゲームを作成します",
};

/**
 * Game Creation Page
 * Displays the GameForm component for creating new games
 */
export default function CreateGamePage() {
	return (
		<main className="min-h-screen bg-gray-50 py-8">
			<GameForm />
		</main>
	);
}
