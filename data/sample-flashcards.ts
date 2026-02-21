import { Flashcard } from '../types/flashcard';

export const sampleFlashcards: Flashcard[] = [
  {
    id: 1,
    term: "人工知能 (AI)",
    definition: "人間の知能をコンピュータで模倣・再現しようとする技術の総称。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 2,
    term: "機械学習 (Machine Learning)",
    definition: "データからルールやパターンを学習し、予測や判断を行うAIの技術。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 3,
    term: "ディープラーニング (Deep Learning)",
    definition: "人間の脳神経回路を模したニューラルネットワークを多層化し、複雑な特徴を学習する手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 4,
    term: "シンギュラリティ (技術的特異点)",
    definition: "AIが人間の知能を超え、技術の進歩が予測不能な速度で加速する時点。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 5,
    term: "チューリングテスト",
    definition: "AIが人間と区別がつかないほど自然な対話ができるかを判定するテスト。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 6,
    term: "強いAI (Strong AI)",
    definition: "人間のように自意識を持ち、全認知能力を有するAI。汎用人工知能(AGI)とも呼ばれる。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 7,
    term: "弱いAI (Weak AI)",
    definition: "特定のタスクのみを処理できるAI。現在のAIのほとんどはこれに分類される。特化型人工知能(ANI)。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 8,
    term: "フレーム問題",
    definition: "有限の情報処理能力しか持たないAIが、現実世界の無限の事象から「何が重要で何が重要でないか」を判断できない問題。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 9,
    term: "シンボルグラウンディング問題",
    definition: "AIが記号（言葉）の意味を、実世界の身体的感覚や経験と結びつけられない問題。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 10,
    term: "モラベックのパラドックス",
    definition: "高度な推論は計算資源が少なく済むが、感覚運動スキル（歩行や知覚など）は膨大な計算資源を要するという逆説。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 11,
    term: "ノーフリーランチ定理",
    definition: "あらゆる問題に対して万能な最適化アルゴリズムは存在しないという定理。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 12,
    term: "教師あり学習",
    definition: "正解データ（ラベル）付きのデータセットを用いて学習させる手法。分類や回帰に使われる。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 13,
    term: "教師なし学習",
    definition: "正解データを与えず、データそのものの構造や特徴を学習させる手法。クラスタリングや次元削減など。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 14,
    term: "強化学習",
    definition: "エージェントが環境と相互作用し、得られる報酬を最大化するように行動を学習する手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 15,
    term: "ニューラルネットワーク",
    definition: "人間の脳の神経回路網を数理モデル化したもの。入力層、中間層、出力層から成る。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 16,
    term: "パーセプトロン",
    definition: "ニューラルネットワークの最も基本的なモデル。複数の入力を受け取り、一つの出力を返す。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 17,
    term: "バックプロパゲーション (誤差逆伝播法)",
    definition: "出力と正解の誤差をネットワークを逆方向に伝播させ、重みを更新する学習アルゴリズム。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 18,
    term: "過学習 (Overfitting)",
    definition: "学習データに適合しすぎて、未知のデータに対する予測精度が下がってしまう現象。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 19,
    term: "エキスパートシステム",
    definition: "特定の専門分野の知識をルールベースで記述し、専門家のように推論を行う初期のAIシステム。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 20,
    term: "ダートマス会議",
    definition: "1956年に開催され、「人工知能（Artificial Intelligence）」という言葉が初めて使われた会議。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 21,
    term: "生成AI (Generative AI)",
    definition: "学習データから新しいコンテンツ（テキスト、画像、音声など）を生成できるAI。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 22,
    term: "LLM (Large Language Model)",
    definition: "大量のテキストデータで学習された大規模言語モデル。GPT-4などが代表例。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 23,
    term: "ハルシネーション",
    definition: "AIが事実に基づかない、もっともらしい嘘の情報を生成してしまう現象。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 24,
    term: "プロンプト",
    definition: "生成AIに対して入力する指示や質問のこと。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 25,
    term: "マルチモーダル",
    definition: "テキスト、画像、音声など、複数の種類のデータを同時に処理できる能力。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 26,
    term: "VAE (変分オートエンコーダ)",
    definition: "データを潜在空間に圧縮し、そこから再構築することでデータを生成するニューラルネットワーク。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 27,
    term: "GAN (敵対的生成ネットワーク)",
    definition: "生成器(Generator)と識別器(Discriminator)を競わせて学習し、高品質なデータを生成するモデル。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 28,
    term: "拡散モデル (Diffusion Model)",
    definition: "画像にノイズを徐々に加え、それを逆再生してノイズを除去する過程を学習することで画像を生成するモデル。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 29,
    term: "Transformer",
    definition: "自然言語処理のブレイクスルーとなった、Attention機構を用いた深層学習モデル。GPTの基礎。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 30,
    term: "Attention機構 (注意機構)",
    definition: "入力データのどの部分に注目すべきかを重み付けする仕組み。文脈理解に不可欠。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 31,
    term: "BERT",
    definition: "Googleが開発した、文の前後双方向から文脈を学習する言語モデル。検索や翻訳などで活用。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 32,
    term: "基盤モデル (Foundation Model)",
    definition: "大量のデータで事前学習され、微調整することで様々なタスクに適応できる大規模モデル。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 33,
    term: "パラメータ数",
    definition: "AIモデルの規模や複雑さを表す指標。一般に多いほど性能が高いが、計算コストも増える。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 34,
    term: "トークン",
    definition: "自然言語処理において、文章を意味のある最小単位に分割したもの。単語や文字の一部など。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 35,
    term: "エンベディング (埋め込み)",
    definition: "単語や文章をベクトル（数値の列）に変換し、意味的な近さを計算できるようにする技術。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 36,
    term: "ゼロショット学習",
    definition: "学習時に見たことのないタスクやクラスを、追加学習なしで処理する能力。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 37,
    term: "ワンショット学習",
    definition: "たった1つの例を与えるだけで、新しいタスクを学習・実行する能力。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 38,
    term: "スケーリング則",
    definition: "モデルの規模、データ量、計算量を増やすと、性能がべき乗則に従って向上するという経験則。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 39,
    term: "アライメント",
    definition: "AIの振る舞いを人間の意図や価値観に合致させるように調整すること。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 40,
    term: "RLHF (Reinforcement Learning from Human Feedback)",
    definition: "人間のフィードバックを用いた強化学習。ChatGPTの調整に使われた重要な手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 41,
    term: "ChatGPT",
    definition: "OpenAIが開発した、対話型の生成AIサービス。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 42,
    term: "Stable Diffusion",
    definition: "テキストから画像を生成する代表的なオープンソースの画像生成AIモデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 43,
    term: "Copilot",
    definition: "Microsoftなどが提供する、AIが人間の作業を支援する「副操縦士」というコンセプト。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 44,
    term: "RAG (Retrieval-Augmented Generation)",
    definition: "外部データの検索結果をプロンプトに含め、回答の正確性を高める技術（検索拡張生成）。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 45,
    term: "ファインチューニング",
    definition: "事前学習済みモデルに対し、特定のデータで追加学習を行い、モデルを微調整すること。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 46,
    term: "OpenAI",
    definition: "ChatGPTやDALL-Eなどを開発した、アメリカのAI研究企業。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 47,
    term: "Gemini",
    definition: "Googleが開発したマルチモーダル生成AIモデル。テキスト、画像、音声、動画を理解・生成できる。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 48,
    term: "Claude",
    definition: "Anthropic社が開発したAIモデル。安全性と有用性を重視して設計されている。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 49,
    term: "Llama",
    definition: "Meta社が公開している大規模言語モデル。オープンソース（に近い形）で提供され、研究開発を加速させた。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 50,
    term: "Midjourney",
    definition: "Discord上で動作する、高品質な画像生成AIサービス。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 51,
    term: "Adobe Firefly",
    definition: "Adobeが提供する画像生成AI。著作権的にクリーンな画像で学習されているのが特徴。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 52,
    term: "Sora",
    definition: "OpenAIが発表した、テキストから高品質な動画を生成するAIモデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 53,
    term: "API (Application Programming Interface)",
    definition: "外部のアプリやプログラムからAIの機能を利用するための窓口。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 54,
    term: "プラグイン (Plugin)",
    definition: "生成AIに外部ツールの機能を追加し、Web検索や計算などを可能にする拡張機能。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 55,
    term: "マルチエージェント",
    definition: "複数のAIエージェントが連携・協力して、複雑なタスクを解決するシステム。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 56,
    term: "エッジAI",
    definition: "クラウドではなく、端末（スマホやPCなど）側でAI処理を行う技術。プライバシー保護や低遅延が利点。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 57,
    term: "SLM (Small Language Model)",
    definition: "パラメータ数を抑え、PCやスマホでも動作するように軽量化された言語モデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 58,
    term: "オープンソースAI",
    definition: "モデルの設計図や重みデータが公開され、誰でも利用・改変できるAI。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 59,
    term: "クローズドソースAI",
    definition: "モデルの詳細が非公開で、APIなどを通じて利用するAI。GPT-4など。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 60,
    term: "モデル崩壊 (Model Collapse)",
    definition: "AIが生成したデータをAIが学習し続けることで、モデルの品質が徐々に低下する現象。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 61,
    term: "AIリテラシー",
    definition: "AIの特性やリスクを理解し、適切に活用・評価する能力。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 62,
    term: "著作権法第30条の4",
    definition: "AI学習のための情報解析などにおいて、原則として著作物の利用を認める日本の法律。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 63,
    term: "ディープフェイク",
    definition: "AIを用いて合成された、本物そっくりの偽の動画や音声。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 64,
    term: "オプトアウト",
    definition: "自分のデータをAIの学習に利用されないように拒否する設定や手続き。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 65,
    term: "ELSI",
    definition: "倫理的・法的・社会的課題 (Ethical, Legal, and Social Issues) の略。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 66,
    term: "バイアス",
    definition: "学習データの偏りなどにより、AIの判断が不公平になったり差別的になったりする問題。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 67,
    term: "プライバシー侵害",
    definition: "AIが学習データに含まれる個人情報を記憶し、意図せず出力してしまうリスク。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 68,
    term: "プロンプトインジェクション",
    definition: "特殊な命令を入力することで、AIの安全装置を回避し、不適切な出力をさせる攻撃。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 69,
    term: "GDPR (EU一般データ保護規則)",
    definition: "EUの厳格な個人データ保護法。AIによる自動化された意思決定への異議申し立て権などを含む。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 70,
    term: "EU AI法 (EU AI Act)",
    definition: "リスクベースアプローチを採用した、世界初の包括的なAI規制法。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 71,
    term: "広島AIプロセス",
    definition: "G7広島サミットで合意された、生成AIの国際的なルール作りの枠組み。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 72,
    term: "AIセーフティインスティテュート (AISI)",
    definition: "AIの安全性を評価・研究するために各国に設立された公的機関。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 73,
    term: "著作権侵害リスク",
    definition: "生成AIが既存の著作物に酷似したものを生成し、利用者がそれを公開した場合のリスク。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 74,
    term: "責任あるAI (Responsible AI)",
    definition: "倫理的、法的、社会的な影響を考慮し、公平性や透明性を担保して開発・運用されるAI。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 75,
    term: "説明可能性 (XAI)",
    definition: "AIがなぜその結論に至ったのか、人間が理解できるように説明できる能力。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 76,
    term: "透明性",
    definition: "AIの学習データやアルゴリズム、限界などが適切に開示されていること。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 77,
    term: "公平性",
    definition: "特定の属性（人種、性別など）に対して不当な差別を行わないこと。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 78,
    term: "アカウンタビリティ (説明責任)",
    definition: "AIシステムの開発者や運用者が、その結果に対して責任を持つこと。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 79,
    term: "フィルターバブル",
    definition: "AIのレコメンドにより、自分の好みに合う情報ばかりが表示され、視野が狭くなる現象。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 80,
    term: "エコーチェンバー",
    definition: "同じ意見を持つ人々とばかり交流し、特定の思想が増幅・強化される現象。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 81,
    term: "プロンプトエンジニアリング",
    definition: "AIから望ましい出力を得るために、入力（プロンプト）を最適化する技術。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 82,
    term: "Few-shotプロンプティング",
    definition: "プロンプトに少数の例示（ショット）を含めることで、AIの回答精度を高める手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 83,
    term: "CoT (Chain of Thought)",
    definition: "「ステップバイステップで考えて」と指示するなど、推論過程を出力させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 84,
    term: "ペルソナ設定",
    definition: "「あなたはプロの編集者です」のように役割を与え、視点や回答の質を制御する手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 85,
    term: "深津式プロンプト",
    definition: "命令、制約条件、入力、出力などを明確に構造化して記述するプロンプトのフレームワーク。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 86,
    term: "ゼロショットプロンプティング",
    definition: "例示を与えずに、指示のみでタスクを実行させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 87,
    term: "Zero-shot CoT",
    definition: "「ステップバイステップで考えて」と追加するだけで、推論能力を向上させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 88,
    term: "ReAct",
    definition: "Reasoning（推論）とActing（行動）を組み合わせ、AIに思考と外部ツールの利用を交互に行わせる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 89,
    term: "方向性刺激プロンプティング (Directional Stimulus Prompting)",
    definition: "ヒントやキーワードを与えて、AIの生成内容を特定の方向に誘導する手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 90,
    term: "生成知識プロンプティング (Generated Knowledge Prompting)",
    definition: "AIにまず関連知識を生成させ、それを使って回答させることで精度を高める手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 91,
    term: "デリミタ (区切り文字)",
    definition: "プロンプト内で、指示と入力テキストなどを明確に分けるための記号（###, \"\"\", ---など）。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 92,
    term: "出力形式の指定",
    definition: "「表形式で」「JSONで」「箇条書きで」など、AIの出力フォーマットを具体的に指示すること。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 93,
    term: "コンテキストの提供",
    definition: "背景情報や前提条件を詳しく伝えることで、AIの回答の質を向上させること。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 94,
    term: "制約条件の付与",
    definition: "「〇〇文字以内で」「専門用語を使わずに」など、生成内容に対する制限を設けること。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 95,
    term: "役割ロールプレイング",
    definition: "AIに特定の役割（教師、コンサルタントなど）を演じさせることで、口調や視点を調整する。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 96,
    term: "再帰的プロンプティング",
    definition: "AIの出力を次のプロンプトの入力として使い、段階的に成果物を洗練させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 97,
    term: "メタプロンプト",
    definition: "プロンプトを作成するためのプロンプト。AIにプロンプトを改善させる際などに使う。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 98,
    term: "ゴールシークプロンプト",
    definition: "最終的な目標だけを伝え、そのために必要な手順や情報をAIに考えさせる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 99,
    term: "否定命令 vs 肯定命令",
    definition: "「〇〇しないで」よりも「〇〇して」という肯定形の指示の方が、AIは従いやすい傾向がある。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 100,
    term: "プロンプトインジェクション対策",
    definition: "入力を区切り文字で囲む、入力の長さを制限するなどの防御策。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_basic_001"
  },
  {
    id: 101,
    term: "知識グラフ",
    definition: "概念同士の関係をノードとエッジで表現し、推論や検索に活用する知識表現。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 102,
    term: "状態空間探索",
    definition: "問題を状態と遷移で表し、初期状態から目標状態までの経路を探索する手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 103,
    term: "ビームサーチ",
    definition: "各段階で評価値の高い候補を一定数だけ残して探索効率を高める近似探索法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 104,
    term: "A*探索",
    definition: "実コストと推定残コストを合計した評価関数で最短経路を効率的に求める探索法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 105,
    term: "ミニマックス法",
    definition: "対戦ゲームで相手が最善手を選ぶと仮定し、自分の最悪損失を最小化する意思決定法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 106,
    term: "サポートベクターマシン（SVM）",
    definition: "クラス間のマージンを最大化する境界面を学習して分類する教師あり学習アルゴリズム。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 107,
    term: "決定木学習",
    definition: "特徴量に基づく分岐を木構造で学習し、分類や回帰を行う機械学習手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 108,
    term: "ランダムフォレスト",
    definition: "複数の決定木をランダムに学習して結果を統合し、過学習を抑えて精度を高める手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 109,
    term: "勾配ブースティング",
    definition: "前段モデルの誤差を次段モデルで補正しながら弱学習器を逐次的に組み合わせる手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 110,
    term: "活性化関数",
    definition: "ニューラルネットワークで非線形性を導入し、複雑な関数近似を可能にする関数。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 111,
    term: "ReLU関数",
    definition: "入力が0以下なら0、正ならそのまま出力する計算が軽い活性化関数。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 112,
    term: "バッチ正規化",
    definition: "各層の入力分布を安定化して学習を高速化し、過学習の抑制にも寄与する手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 113,
    term: "ドロップアウト",
    definition: "学習時に一部ユニットを確率的に無効化し、共適応を防いで汎化性能を高める正則化手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 114,
    term: "転移学習",
    definition: "既存モデルで学習済みの特徴を別タスクへ再利用し、少量データでも高精度化を狙う学習法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 115,
    term: "事前学習モデル",
    definition: "大規模データで汎用的な表現を獲得した後、下流タスクに適用される学習済みモデル。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 116,
    term: "蒸留モデル",
    definition: "大規模教師モデルの出力分布を学習して、小型モデルへ知識を移すモデル圧縮手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 117,
    term: "自己教師あり学習",
    definition: "ラベルのないデータから擬似的な学習課題を作成し、表現学習を進める学習方法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 118,
    term: "メタ学習",
    definition: "複数タスクで学習方法そのものを学び、新しい課題へ少ない試行で適応する枠組み。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 119,
    term: "ハイパーパラメータ最適化",
    definition: "学習率や層数などの設定値を探索し、モデル性能を最大化する最適化プロセス。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 120,
    term: "データ拡張",
    definition: "回転や置換などで学習データを人工的に増やし、モデルの汎化性能を向上させる手法。",
    chapter: "第1章：AI（人工知能）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 121,
    term: "コンテキストウィンドウ",
    definition: "モデルが一度に参照できる入力トークン範囲で、長い文脈処理能力を左右する指標。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 122,
    term: "Temperature",
    definition: "出力確率分布の鋭さを調整し、低いほど安定、高いほど多様な生成になりやすい設定値。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 123,
    term: "Top-pサンプリング",
    definition: "累積確率がしきい値pに達する候補集合から次トークンを選ぶ確率的デコーディング手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 124,
    term: "Top-kサンプリング",
    definition: "確率上位k件の候補に限定して次トークンを選ぶことで出力の暴走を抑える手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 125,
    term: "デコーディング戦略",
    definition: "生成時のトークン選択方法を定める手順で、品質や多様性、速度に影響する。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 126,
    term: "指示チューニング",
    definition: "指示と応答の対データで追加学習し、人の命令に従いやすい振る舞いへ調整する手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 127,
    term: "SFT（教師あり微調整）",
    definition: "高品質な正解例で追加学習を行い、特定タスクに適した応答特性を獲得する工程。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 128,
    term: "DPO",
    definition: "好ましい回答と好ましくない回答の対比較から直接選好を学習する最適化手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 129,
    term: "LoRA",
    definition: "低ランク行列のみを学習して微調整コストを抑えるパラメータ効率化手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 130,
    term: "QLoRA",
    definition: "量子化とLoRAを組み合わせ、少ないGPUメモリで高性能微調整を可能にする手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 131,
    term: "量子化推論",
    definition: "重みや演算を低ビット化して、推論速度とメモリ効率を改善する最適化手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 132,
    term: "Mixture of Experts（MoE）",
    definition: "入力に応じて一部専門家ネットワークのみ活性化し、計算効率と性能を両立する構成。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 133,
    term: "システムプロンプト",
    definition: "モデルの役割・口調・安全方針などの上位ルールを固定するための初期指示。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 134,
    term: "Function Calling",
    definition: "モデル出力を構造化し、外部関数やAPI呼び出しに安全に接続する機能。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 135,
    term: "ツール実行",
    definition: "検索や計算など外部ツールを呼び出して、モデル単体では不足する能力を補完する仕組み。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 136,
    term: "出力ガードレール",
    definition: "禁止事項や形式制約を適用し、危険・不適切な出力を抑制する制御機構。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 137,
    term: "推論トークン",
    definition: "入力と出力で消費されるトークン量で、コストと応答速度に直接影響する単位。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 138,
    term: "推論レイテンシ",
    definition: "リクエスト送信から応答受信までの遅延時間で、体験品質の重要指標となる。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 139,
    term: "モデルルーティング",
    definition: "要求内容に応じて複数モデルを振り分け、品質とコストを最適化する運用手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 140,
    term: "マルチターン最適化",
    definition: "対話履歴を活用して応答精度を維持しつつ、文脈肥大を抑える設計・制御手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 141,
    term: "オンデバイス推論",
    definition: "クラウドではなく端末内でモデル推論を実行し、低遅延とプライバシー保護を図る方式。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 142,
    term: "NPU（Neural Processing Unit）",
    definition: "AI演算に特化したプロセッサで、端末上の推論処理を高速・省電力で実行する。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 143,
    term: "推論最適化エンジン",
    definition: "演算融合や量子化などでモデル実行を高速化するランタイム最適化基盤。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 144,
    term: "KVキャッシュ",
    definition: "自己注意計算の中間結果を再利用し、長文生成時の計算量を削減する仕組み。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 145,
    term: "Speculative Decoding",
    definition: "軽量モデルの予測を先行利用して本モデルの生成を加速する推論高速化手法。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 146,
    term: "AIエージェント基盤",
    definition: "計画・実行・観測を反復し、外部ツール連携で目標達成を自動化する実行フレームワーク。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 147,
    term: "LLMOps",
    definition: "モデル運用を継続的に管理し、評価・監視・改善を回すための実務運用体系。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 148,
    term: "モデルカード",
    definition: "モデル用途、性能、制約、倫理上の注意点を整理して公開する説明ドキュメント。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 149,
    term: "データカード",
    definition: "学習データの出所、収集条件、偏り、利用上の注意を記述する説明資料。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 150,
    term: "レッドチーミング",
    definition: "想定外入力や攻撃的条件でモデル弱点を検証し、安全性向上に反映する評価手法。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 151,
    term: "安全性評価ベンチマーク",
    definition: "有害出力や差別表現などのリスク観点でモデル挙動を比較評価する指標群。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 152,
    term: "合成データ生成",
    definition: "実データ不足を補うために人工的な学習データを作成し、学習効率を高める手法。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 153,
    term: "小型マルチモーダルモデル",
    definition: "端末でも扱える規模で、テキストと画像など複数入力を処理できるモデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 154,
    term: "音声対話モデル",
    definition: "音声入力理解と音声出力生成を組み合わせ、自然な会話体験を実現するモデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 155,
    term: "動画理解モデル",
    definition: "時系列フレームと音声情報を統合して、動画内容を解析・要約するモデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 156,
    term: "マルチLLMオーケストレーション",
    definition: "複数モデルの役割分担を設計し、総合性能と安定性を高める運用アーキテクチャ。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 157,
    term: "企業向けAIゲートウェイ",
    definition: "認証、監査、ポリシー制御を統合して社内AI利用を安全に中継する仕組み。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 158,
    term: "推論コスト管理",
    definition: "モデル選択やトークン制御で利用単価を最適化し、運用予算超過を防ぐ管理手法。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 159,
    term: "ガードレール監視",
    definition: "安全制約の逸脱を継続監視し、ポリシー違反時に遮断や再生成を行う運用。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 160,
    term: "生成AI監査ログ",
    definition: "入力・出力・実行操作を記録し、後から説明責任や不正調査に活用する証跡。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 161,
    term: "個人情報保護法",
    definition: "個人情報の取得・利用・保管・提供に関する基本ルールを定める日本の法律。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 162,
    term: "要配慮個人情報",
    definition: "差別や不利益につながるおそれが高く、取得や取扱いに特段の配慮が必要な情報。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 163,
    term: "匿名加工情報",
    definition: "個人を識別できないよう加工し、復元不可能性を担保したうえで活用する情報。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 164,
    term: "仮名加工情報",
    definition: "社内分析などを目的に識別子を置換し、本人特定リスクを下げた加工情報。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 165,
    term: "利用目的の特定",
    definition: "データ収集時に用途をできる限り具体化し、目的外利用を防ぐ原則。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 166,
    term: "データ最小化",
    definition: "業務目的達成に必要な最小限のデータのみ取得・保持するプライバシー原則。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 167,
    term: "同意管理",
    definition: "利用者の同意取得・変更・撤回を記録し、適法性を継続的に担保する仕組み。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 168,
    term: "アクセス制御",
    definition: "権限に応じてデータや機能の利用範囲を制限し、内部不正や漏えいを防ぐ対策。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 169,
    term: "監査ログ保全",
    definition: "誰がいつ何を操作したかを改ざん困難な形で保存し、追跡可能性を確保する管理。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 170,
    term: "インシデントレスポンス",
    definition: "漏えい・不正利用発生時に封じ込め、原因調査、再発防止まで進める対応手順。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 171,
    term: "AIガバナンス体制",
    definition: "意思決定責任、審査基準、運用監督を組織的に定義してAI利用を統制する枠組み。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 172,
    term: "リスクアセスメント",
    definition: "導入前に影響範囲と発生確率を評価し、優先順位をつけて対策を設計する活動。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 173,
    term: "モデル監査",
    definition: "学習データ、性能、バイアス、説明可能性を第三者視点で検証する監査プロセス。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 174,
    term: "データガバナンス",
    definition: "データ品質、責任分担、利用ルールを定義し、全社的に統制する管理体系。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 175,
    term: "ヒューマン・イン・ザ・ループ",
    definition: "重要判断に人間の確認工程を組み込み、AIの誤判定リスクを低減する設計。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 176,
    term: "説明責任文書化",
    definition: "モデル選定理由や評価結果を記録し、後から妥当性を説明できる状態にする実務。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 177,
    term: "出力真正性表示",
    definition: "生成コンテンツにAI生成であることを明示し、誤認や悪用を防ぐ表示措置。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 178,
    term: "電子透かし",
    definition: "生成物に検出可能な識別情報を埋め込み、由来追跡や改ざん検知を支援する技術。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 179,
    term: "コンテンツモデレーション",
    definition: "有害・違法・不適切な生成物を検知し、表示制限や削除を行う運用管理。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 180,
    term: "レッドラインポリシー",
    definition: "業務利用で絶対禁止とする入力・出力条件を明文化した安全運用ルール。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 181,
    term: "タスク分解プロンプト",
    definition: "複雑な依頼を小さな工程に分け、順番に出力させることで品質を安定させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 182,
    term: "評価基準先出しプロンプト",
    definition: "採点観点を先に提示し、その基準に沿って回答を生成させる設計手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 183,
    term: "逆質問プロンプト",
    definition: "不足情報がある場合に先に確認質問を返させ、要件誤解を減らす指示手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 184,
    term: "出力検証プロンプト",
    definition: "生成後に自己チェック項目で検証させ、誤りや漏れを減らす再確認手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 185,
    term: "反例提示プロンプト",
    definition: "誤った例を先に示して避けるべきパターンを明確化し、品質を向上させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 186,
    term: "JSONスキーマ制約",
    definition: "キーや型を指定した構造化出力を要求し、後続処理しやすい結果を得る方法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 187,
    term: "スタイルガイド指定",
    definition: "語調、表記、文長の基準を明示し、複数出力間の一貫性を保つプロンプト設計。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 188,
    term: "観点指定プロンプト",
    definition: "技術・法務・業務など評価観点を限定し、論点の抜け漏れを抑える手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 189,
    term: "段階的要約プロンプト",
    definition: "長文を複数段階で圧縮し、情報の重要度を保ちながら要約精度を高める手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 190,
    term: "比較表生成プロンプト",
    definition: "比較軸を固定して表形式で整理させ、意思決定に必要な差分を可視化する手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 191,
    term: "読者ペルソナ指定",
    definition: "対象読者の知識水準を指定し、難易度や語彙を最適化して説明させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 192,
    term: "トーン調整プロンプト",
    definition: "丁寧・簡潔・専門的など文体を制御し、利用場面に合う応答を引き出す手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 193,
    term: "制約付きリライト",
    definition: "文字数や禁止語を条件に文章を書き換え、要件に合う表現へ調整する手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 194,
    term: "事実確認プロンプト",
    definition: "推測と事実を分離させ、根拠確認を促して誤情報リスクを下げる指示手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 195,
    term: "引用元明示プロンプト",
    definition: "参照した根拠や出典を明記させ、検証可能性を高めるための指示方法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 196,
    term: "禁則語指定プロンプト",
    definition: "使用禁止表現を指定して、業界ルールやブランド基準への違反を防ぐ手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 197,
    term: "チェックリスト生成プロンプト",
    definition: "作業前後に確認すべき項目を列挙させ、品質管理を標準化する手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 198,
    term: "プロンプトテンプレート化",
    definition: "再利用可能な入力雛形を整備し、業務での品質と速度を両立する運用手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 199,
    term: "改善ループプロンプト",
    definition: "出力を評価し修正指示を繰り返して、段階的に成果物を洗練する運用手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
  {
    id: 200,
    term: "ワークフロープロンプト",
    definition: "入力から最終成果までの手順を定義し、複数工程を安定実行させる指示手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例",
    packId: "flashcard_pack_plus_001"
  },
];
