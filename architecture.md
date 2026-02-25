# UsoHontoGame アーキテクチャガイド

このドキュメントでは、UsoHontoGameプロジェクトのアーキテクチャ設計思想とパターンを説明します。

b コマンドや環境セットアップの詳細は[README.md](./README.md)を参照してください。

---

## アーキテクチャ概要

このプロジェクトは**クリーンアーキテクチャ**と**ドメイン駆動設計（DDD）**の原則に従っています。

### 主要な設計原則

1. **関心の分離**: 各層には明確に定義された責任があります
2. **依存性逆転**: 内側の層は外側の層に依存しません
3. **境界での検証**: Zodによる実行時検証をAPI境界で実施
4. **リポジトリパターン**: データアクセスの抽象化
5. **Application Service層**: ビジネスロジックの調整とユースケースの実行

### アーキテクチャ層

```
┌─────────────────────────────────────────────────┐
│ プレゼンテーション層                              │
│ - Next.js App Routerページ                      │
│ - Reactコンポーネント                            │
│ - Server Actions (薄いラッパー)                  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Application Service層                            │
│ - セッション取得                                 │
│ - リポジトリ注入                                 │
│ - ユースケース実行                               │
│ - エラー変換（Domain → Service）                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ アプリケーション層                                │
│ - ユースケース                                   │
│ - DTO（データ転送オブジェクト）                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ ドメイン層                                       │
│ - エンティティ                                   │
│ - 値オブジェクト                                 │
│ - リポジトリインターフェース                      │
│ - ドメインエラー                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ インフラストラクチャ層                            │
│ - Prismaリポジトリ実装                           │
│ - データベースアクセス                           │
│ - 外部API統合                                    │
└─────────────────────────────────────────────────┘
```

---

## プロジェクト構造

```
.
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── actions/                # サーバーアクション
│   │   ├── api/                    # APIルート
│   │   ├── games/                  # ゲームページ
│   │   │   ├── [id]/
│   │   │   │   ├── answer/         # 回答送信ページ
│   │   │   │   ├── dashboard/      # ダッシュボード
│   │   │   │   ├── presenters/     # 出題者管理
│   │   │   │   └── results/        # 結果表示
│   │   │   ├── create/             # ゲーム作成
│   │   │   └── page.tsx            # ゲーム一覧
│   │   └── page.tsx                # TOP（セッション）
│   ├── components/
│   │   ├── domain/                 # ドメインコンポーネント
│   │   ├── pages/                  # ページコンポーネント
│   │   └── ui/                     # 再利用可能なUI
│   ├── hooks/                      # カスタムReactフック
│   ├── lib/                        # ユーティリティ
│   ├── server/
│   │   ├── application/            # ユースケース・DTO
│   │   ├── domain/                 # ドメイン層
│   │   └── infrastructure/         # 外部依存関係
│   └── types/                      # TypeScript型定義
├── tests/
│   ├── e2e/                        # Playwright E2Eテスト
│   ├── integration/                # 統合テスト
│   └── utils/                      # テストユーティリティ
├── prisma/
│   ├── schema.prisma               # データベーススキーマ
│   ├── migrations/                 # マイグレーションファイル
│   └── dev.db                      # SQLiteデータベース
└── specs/                          # 機能仕様
```

---

## フロントエンドアーキテクチャ

### コンポーネント組織化

コンポーネントは3つの層に分かれています：

#### 1. Pagesコンポーネント

**目的**: ページレベルのレイアウトとUI構成

**責任**:
- ページレイアウトとセクション構造の定義
- ドメインコンポーネントとUIコンポーネントの組み合わせ
- ビジネスロジックのためのカスタムフックの呼び出し

**担当しない責任**:
- データフェッチ
- ステート管理

#### 2. Domainコンポーネント

**目的**: ドメイン固有のビジネスロジックとUI

**責任**:
- ドメインエンティティの表示（Game、Presenter、Episode、Answer）
- ドメイン固有の操作（ゲーム開始、エピソード追加、回答送信）
- ドメインルールの検証表示

#### 3. UIコンポーネント

**目的**: 再利用可能なプレゼンテーショナルコンポーネント

**責任**:
- 汎用的なUI要素（Button、Input、Card、Modal）
- ドメインロジックを含まない
- 高度に再利用可能

### App Routerページ分離パターン

**原則**: App Routerページは薄いラッパーであるべき

#### App Router Pageの責任

**担当すべきこと**:
1. ルートパラメータ抽出
2. 認証・認可チェック
3. データフェッチ（Server Componentsのみ）
4. エラーステート処理
5. ページコンポーネントへの委譲

**担当すべきでないこと**:
- UIレンダリング（エラーステート以外）
- ビジネスロジック
- ステート管理
- イベントハンドラー
- フォームロジック

### カスタムフックアーキテクチャ

**目的**: ビジネスロジックのカプセル化

**配置**: `src/components/pages/*/hooks/`（Client Componentsのみ）

**責任**:
- ステート管理
- データフェッチ/ミューテーション
- イベントハンドラー
- 副作用

**命名規則**: `use[PageName]` (例: `useGameDetailPage`)

---

## バックエンドアーキテクチャ

### Application Service層

**目的**: ビジネスロジックの調整とユースケースの実行

**責任**:
1. セッション取得（`SessionServiceContainer`経由）
2. リポジトリ注入（ファクトリー関数経由）
3. ユースケース実行
4. ドメインエラー → サービスエラー形式への変換

**担当しない責任**:
- FormDataパース（Server Actionの責任）
- Zodバリデーション（Server Actionの責任）
- revalidatePath（Server Actionの責任）
- ビジネスロジック（UseCaseの責任）

#### 提供するApplication Services

1. **GameApplicationService**: ゲーム管理
2. **PresenterApplicationService**: 出題者管理
3. **AnswerApplicationService**: 回答管理
4. **SessionApplicationService**: セッション管理

#### 型定義

```typescript
export type ServiceSuccess<T> = {
  success: true;
  data: T;
};

export type ServiceError = {
  success: false;
  errors: Record<string, string[]>;
};

export type ServiceResponse<T> = ServiceSuccess<T> | ServiceError;
```

#### 基本パターン

**Application Service**:
```typescript
async methodName(input: Input): Promise<ServiceResponse<Output>> {
  try {
    // 1. セッション取得
    const sessionId = await sessionService.requireCurrentSession();

    // 2. リポジトリ・UseCase準備
    const repository = createRepository();
    const useCase = new UseCase(repository);

    // 3. UseCase実行
    const result = await useCase.execute(input);

    return { success: true, data: result };
  } catch (error) {
    return mapDomainErrorToServiceError(error, 'message.key');
  }
}
```

**Server Action**:
```typescript
export async function myAction(formData: FormData) {
  // 1. FormDataパース
  const rawData = { ... };

  // 2. Zodバリデーション
  const validation = Schema.safeParse(rawData);
  if (!validation.success) return { success: false, errors: ... };

  // 3. Application Service呼び出し
  const result = await applicationService.method(validation.data);

  // 4. 成功時のみrevalidatePath
  if (result.success) {
    revalidatePath('/path');
  }

  return result;
}
```

### ドメイン層

**目的**: ビジネスロジックとドメインルールをカプセル化

#### エンティティ

ビジネスエンティティとライフサイクルをモデル化：

- **Game**: `canStart()`, `canClose()`, `isOwnedBy()`
- **Presenter**: `hasRequiredEpisodes()`
- **Episode**: エピソードエンティティ
- **Answer**: 回答エンティティ

#### 値オブジェクト

不変の値とバリデーションルールをカプセル化：

- **GameId**: nanoid生成、バリデーション
- **GameStatus**: ステータス遷移ルール
- **SessionId**: セッション識別子
- **Nickname**: ニックネーム検証

#### リポジトリインターフェース

データアクセスの抽象化：

```typescript
export interface IGameRepository {
  save(game: Game): Promise<void>;
  findById(id: GameId): Promise<Game | null>;
  findByCreator(creatorId: SessionId): Promise<Game[]>;
  update(game: Game): Promise<void>;
  delete(id: GameId): Promise<void>;
}
```

#### ドメインエラー

- **ValidationError**: バリデーションエラー
- **NotFoundError**: エンティティ未検出
- **UnauthorizedError**: 認可エラー
- **StatusTransitionError**: ステータス遷移エラー

### アプリケーション層

**目的**: ユースケースの実装とデータ転送オブジェクト

#### ユースケース

単一の責任を持つビジネスユースケース：

```typescript
export class CreateGame {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(input: CreateGameInput): Promise<CreateGameOutput> {
    // 1. ドメインエンティティ作成
    const game = Game.create({ ... });

    // 2. リポジトリに永続化
    await this.gameRepository.save(game);

    // 3. DTOに変換して返却
    return toDto(game);
  }
}
```

#### データ転送オブジェクト（DTO）

層間のデータ転送に使用：

- **GameDto**: ゲーム情報
- **PresenterWithLieDto**: 出題者情報（嘘マーク付き）
- **EpisodeWithLieDto**: エピソード情報（嘘マーク付き）

### インフラストラクチャ層

**目的**: 外部システムとの統合

#### リポジトリ実装

- **PrismaGameRepository**: Gameリポジトリ実装
- **PrismaAnswerRepository**: Answerリポジトリ実装
- **CookieSessionRepository**: セッションリポジトリ実装

#### リポジトリファクトリー

```typescript
export function createGameRepository(): IGameRepository {
  return new PrismaGameRepository(getPrismaClient());
}
```

#### 依存性注入（Service Locatorパターン）

```typescript
export class SessionServiceContainer {
  static getSessionService(): ISessionService {
    if (!sessionService) {
      sessionService = new CookieSessionService();
    }
    return sessionService;
  }
}
```

---

## データベーススキーマ

```prisma
model Game {
  id              String          @id @default(uuid())
  name            String?
  creatorId       String
  maxPlayers      Int
  currentPlayers  Int             @default(0)
  status          String          @default("準備中")
  presenters      Presenter[]
  answers         Answer[]
  participations  Participation[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model Presenter {
  id        String    @id @default(uuid())
  gameId    String
  nickname  String
  episodes  Episode[]
  game      Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())
}

model Episode {
  id          String    @id @default(uuid())
  presenterId String
  text        String
  isLie       Boolean
  presenter   Presenter @relation(fields: [presenterId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}

model Answer {
  id         String   @id @default(uuid())
  sessionId  String
  gameId     String
  nickname   String
  selections Json
  game       Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([sessionId, gameId])
}

model Participation {
  id        String   @id @default(uuid())
  sessionId String
  gameId    String
  nickname  String
  joinedAt  DateTime @default(now())
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)

  @@unique([sessionId, gameId])
}
```

