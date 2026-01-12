import { Flashcard } from '../types/flashcard';

export const sampleFlashcards: Flashcard[] = [
  // 第1章：AI（人工知能）
  {
    id: 1,
    term: "人工知能 (AI)",
    definition: "人間の知能をコンピュータで模倣・再現しようとする技術の総称。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 2,
    term: "機械学習 (Machine Learning)",
    definition: "データからルールやパターンを学習し、予測や判断を行うAIの技術。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 3,
    term: "ディープラーニング (Deep Learning)",
    definition: "人間の脳神経回路を模したニューラルネットワークを多層化し、複雑な特徴を学習する手法。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 4,
    term: "シンギュラリティ (技術的特異点)",
    definition: "AIが人間の知能を超え、技術の進歩が予測不能な速度で加速する時点。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 5,
    term: "チューリングテスト",
    definition: "AIが人間と区別がつかないほど自然な対話ができるかを判定するテスト。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 6,
    term: "強いAI (Strong AI)",
    definition: "人間のように自意識を持ち、全認知能力を有するAI。汎用人工知能(AGI)とも呼ばれる。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 7,
    term: "弱いAI (Weak AI)",
    definition: "特定のタスクのみを処理できるAI。現在のAIのほとんどはこれに分類される。特化型人工知能(ANI)。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 8,
    term: "フレーム問題",
    definition: "有限の情報処理能力しか持たないAIが、現実世界の無限の事象から「何が重要で何が重要でないか」を判断できない問題。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 9,
    term: "シンボルグラウンディング問題",
    definition: "AIが記号（言葉）の意味を、実世界の身体的感覚や経験と結びつけられない問題。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 10,
    term: "モラベックのパラドックス",
    definition: "高度な推論は計算資源が少なく済むが、感覚運動スキル（歩行や知覚など）は膨大な計算資源を要するという逆説。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 11,
    term: "ノーフリーランチ定理",
    definition: "あらゆる問題に対して万能な最適化アルゴリズムは存在しないという定理。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 12,
    term: "教師あり学習",
    definition: "正解データ（ラベル）付きのデータセットを用いて学習させる手法。分類や回帰に使われる。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 13,
    term: "教師なし学習",
    definition: "正解データを与えず、データそのものの構造や特徴を学習させる手法。クラスタリングや次元削減など。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 14,
    term: "強化学習",
    definition: "エージェントが環境と相互作用し、得られる報酬を最大化するように行動を学習する手法。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 15,
    term: "ニューラルネットワーク",
    definition: "人間の脳の神経回路網を数理モデル化したもの。入力層、中間層、出力層から成る。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 16,
    term: "パーセプトロン",
    definition: "ニューラルネットワークの最も基本的なモデル。複数の入力を受け取り、一つの出力を返す。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 17,
    term: "バックプロパゲーション (誤差逆伝播法)",
    definition: "出力と正解の誤差をネットワークを逆方向に伝播させ、重みを更新する学習アルゴリズム。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 18,
    term: "過学習 (Overfitting)",
    definition: "学習データに適合しすぎて、未知のデータに対する予測精度が下がってしまう現象。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 19,
    term: "エキスパートシステム",
    definition: "特定の専門分野の知識をルールベースで記述し、専門家のように推論を行う初期のAIシステム。",
    chapter: "第1章：AI（人工知能）"
  },
  {
    id: 20,
    term: "ダートマス会議",
    definition: "1956年に開催され、「人工知能（Artificial Intelligence）」という言葉が初めて使われた会議。",
    chapter: "第1章：AI（人工知能）"
  },

  // 第2章：生成AI（ジェネレーティブAI）
  {
    id: 21,
    term: "生成AI (Generative AI)",
    definition: "学習データから新しいコンテンツ（テキスト、画像、音声など）を生成できるAI。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 22,
    term: "LLM (Large Language Model)",
    definition: "大量のテキストデータで学習された大規模言語モデル。GPT-4などが代表例。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 23,
    term: "ハルシネーション",
    definition: "AIが事実に基づかない、もっともらしい嘘の情報を生成してしまう現象。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 24,
    term: "プロンプト",
    definition: "生成AIに対して入力する指示や質問のこと。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 25,
    term: "マルチモーダル",
    definition: "テキスト、画像、音声など、複数の種類のデータを同時に処理できる能力。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 26,
    term: "VAE (変分オートエンコーダ)",
    definition: "データを潜在空間に圧縮し、そこから再構築することでデータを生成するニューラルネットワーク。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 27,
    term: "GAN (敵対的生成ネットワーク)",
    definition: "生成器(Generator)と識別器(Discriminator)を競わせて学習し、高品質なデータを生成するモデル。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 28,
    term: "拡散モデル (Diffusion Model)",
    definition: "画像にノイズを徐々に加え、それを逆再生してノイズを除去する過程を学習することで画像を生成するモデル。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 29,
    term: "Transformer",
    definition: "自然言語処理のブレイクスルーとなった、Attention機構を用いた深層学習モデル。GPTの基礎。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 30,
    term: "Attention機構 (注意機構)",
    definition: "入力データのどの部分に注目すべきかを重み付けする仕組み。文脈理解に不可欠。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 31,
    term: "BERT",
    definition: "Googleが開発した、文の前後双方向から文脈を学習する言語モデル。検索や翻訳などで活用。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 32,
    term: "基盤モデル (Foundation Model)",
    definition: "大量のデータで事前学習され、微調整することで様々なタスクに適応できる大規模モデル。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 33,
    term: "パラメータ数",
    definition: "AIモデルの規模や複雑さを表す指標。一般に多いほど性能が高いが、計算コストも増える。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 34,
    term: "トークン",
    definition: "自然言語処理において、文章を意味のある最小単位に分割したもの。単語や文字の一部など。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 35,
    term: "エンベディング (埋め込み)",
    definition: "単語や文章をベクトル（数値の列）に変換し、意味的な近さを計算できるようにする技術。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 36,
    term: "ゼロショット学習",
    definition: "学習時に見たことのないタスクやクラスを、追加学習なしで処理する能力。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 37,
    term: "ワンショット学習",
    definition: "たった1つの例を与えるだけで、新しいタスクを学習・実行する能力。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 38,
    term: "スケーリング則",
    definition: "モデルの規模、データ量、計算量を増やすと、性能がべき乗則に従って向上するという経験則。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 39,
    term: "アライメント",
    definition: "AIの振る舞いを人間の意図や価値観に合致させるように調整すること。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },
  {
    id: 40,
    term: "RLHF (Reinforcement Learning from Human Feedback)",
    definition: "人間のフィードバックを用いた強化学習。ChatGPTの調整に使われた重要な手法。",
    chapter: "第2章：生成AI（ジェネレーティブAI）"
  },

  // 第3章：現在の生成AI（ジェネレーティブAI）の動向
  {
    id: 41,
    term: "ChatGPT",
    definition: "OpenAIが開発した、対話型の生成AIサービス。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 42,
    term: "Stable Diffusion",
    definition: "テキストから画像を生成する代表的なオープンソースの画像生成AIモデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 43,
    term: "Copilot",
    definition: "Microsoftなどが提供する、AIが人間の作業を支援する「副操縦士」というコンセプト。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 44,
    term: "RAG (Retrieval-Augmented Generation)",
    definition: "外部データの検索結果をプロンプトに含め、回答の正確性を高める技術（検索拡張生成）。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 45,
    term: "ファインチューニング",
    definition: "事前学習済みモデルに対し、特定のデータで追加学習を行い、モデルを微調整すること。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 46,
    term: "OpenAI",
    definition: "ChatGPTやDALL-Eなどを開発した、アメリカのAI研究企業。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 47,
    term: "Gemini",
    definition: "Googleが開発したマルチモーダル生成AIモデル。テキスト、画像、音声、動画を理解・生成できる。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 48,
    term: "Claude",
    definition: "Anthropic社が開発したAIモデル。安全性と有用性を重視して設計されている。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 49,
    term: "Llama",
    definition: "Meta社が公開している大規模言語モデル。オープンソース（に近い形）で提供され、研究開発を加速させた。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 50,
    term: "Midjourney",
    definition: "Discord上で動作する、高品質な画像生成AIサービス。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 51,
    term: "Adobe Firefly",
    definition: "Adobeが提供する画像生成AI。著作権的にクリーンな画像で学習されているのが特徴。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 52,
    term: "Sora",
    definition: "OpenAIが発表した、テキストから高品質な動画を生成するAIモデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 53,
    term: "API (Application Programming Interface)",
    definition: "外部のアプリやプログラムからAIの機能を利用するための窓口。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 54,
    term: "プラグイン (Plugin)",
    definition: "生成AIに外部ツールの機能を追加し、Web検索や計算などを可能にする拡張機能。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 55,
    term: "マルチエージェント",
    definition: "複数のAIエージェントが連携・協力して、複雑なタスクを解決するシステム。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 56,
    term: "エッジAI",
    definition: "クラウドではなく、端末（スマホやPCなど）側でAI処理を行う技術。プライバシー保護や低遅延が利点。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 57,
    term: "SLM (Small Language Model)",
    definition: "パラメータ数を抑え、PCやスマホでも動作するように軽量化された言語モデル。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 58,
    term: "オープンソースAI",
    definition: "モデルの設計図や重みデータが公開され、誰でも利用・改変できるAI。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 59,
    term: "クローズドソースAI",
    definition: "モデルの詳細が非公開で、APIなどを通じて利用するAI。GPT-4など。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },
  {
    id: 60,
    term: "モデル崩壊 (Model Collapse)",
    definition: "AIが生成したデータをAIが学習し続けることで、モデルの品質が徐々に低下する現象。",
    chapter: "第3章：現在の生成AI（ジェネレーティブAI）の動向"
  },

  // 第4章：情報リテラシー・AI事業者ガイドライン・AI新法
  {
    id: 61,
    term: "AIリテラシー",
    definition: "AIの特性やリスクを理解し、適切に活用・評価する能力。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 62,
    term: "著作権法第30条の4",
    definition: "AI学習のための情報解析などにおいて、原則として著作物の利用を認める日本の法律。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 63,
    term: "ディープフェイク",
    definition: "AIを用いて合成された、本物そっくりの偽の動画や音声。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 64,
    term: "オプトアウト",
    definition: "自分のデータをAIの学習に利用されないように拒否する設定や手続き。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 65,
    term: "ELSI",
    definition: "倫理的・法的・社会的課題 (Ethical, Legal, and Social Issues) の略。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 66,
    term: "バイアス",
    definition: "学習データの偏りなどにより、AIの判断が不公平になったり差別的になったりする問題。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 67,
    term: "プライバシー侵害",
    definition: "AIが学習データに含まれる個人情報を記憶し、意図せず出力してしまうリスク。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 68,
    term: "プロンプトインジェクション",
    definition: "特殊な命令を入力することで、AIの安全装置を回避し、不適切な出力をさせる攻撃。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 69,
    term: "GDPR (EU一般データ保護規則)",
    definition: "EUの厳格な個人データ保護法。AIによる自動化された意思決定への異議申し立て権などを含む。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 70,
    term: "EU AI法 (EU AI Act)",
    definition: "リスクベースアプローチを採用した、世界初の包括的なAI規制法。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 71,
    term: "広島AIプロセス",
    definition: "G7広島サミットで合意された、生成AIの国際的なルール作りの枠組み。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 72,
    term: "AIセーフティインスティテュート (AISI)",
    definition: "AIの安全性を評価・研究するために各国に設立された公的機関。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 73,
    term: "著作権侵害リスク",
    definition: "生成AIが既存の著作物に酷似したものを生成し、利用者がそれを公開した場合のリスク。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 74,
    term: "責任あるAI (Responsible AI)",
    definition: "倫理的、法的、社会的な影響を考慮し、公平性や透明性を担保して開発・運用されるAI。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 75,
    term: "説明可能性 (XAI)",
    definition: "AIがなぜその結論に至ったのか、人間が理解できるように説明できる能力。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 76,
    term: "透明性",
    definition: "AIの学習データやアルゴリズム、限界などが適切に開示されていること。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 77,
    term: "公平性",
    definition: "特定の属性（人種、性別など）に対して不当な差別を行わないこと。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 78,
    term: "アカウンタビリティ (説明責任)",
    definition: "AIシステムの開発者や運用者が、その結果に対して責任を持つこと。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 79,
    term: "フィルターバブル",
    definition: "AIのレコメンドにより、自分の好みに合う情報ばかりが表示され、視野が狭くなる現象。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },
  {
    id: 80,
    term: "エコーチェンバー",
    definition: "同じ意見を持つ人々とばかり交流し、特定の思想が増幅・強化される現象。",
    chapter: "第4章：情報リテラシー・AI事業者ガイドライン・AI新法"
  },

  // 第5章：テキスト生成AIのプロンプト制作と実例
  {
    id: 81,
    term: "プロンプトエンジニアリング",
    definition: "AIから望ましい出力を得るために、入力（プロンプト）を最適化する技術。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 82,
    term: "Few-shotプロンプティング",
    definition: "プロンプトに少数の例示（ショット）を含めることで、AIの回答精度を高める手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 83,
    term: "CoT (Chain of Thought)",
    definition: "「ステップバイステップで考えて」と指示するなど、推論過程を出力させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 84,
    term: "ペルソナ設定",
    definition: "「あなたはプロの編集者です」のように役割を与え、視点や回答の質を制御する手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 85,
    term: "深津式プロンプト",
    definition: "命令、制約条件、入力、出力などを明確に構造化して記述するプロンプトのフレームワーク。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 86,
    term: "ゼロショットプロンプティング",
    definition: "例示を与えずに、指示のみでタスクを実行させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 87,
    term: "Zero-shot CoT",
    definition: "「ステップバイステップで考えて」と追加するだけで、推論能力を向上させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 88,
    term: "ReAct",
    definition: "Reasoning（推論）とActing（行動）を組み合わせ、AIに思考と外部ツールの利用を交互に行わせる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 89,
    term: "方向性刺激プロンプティング (Directional Stimulus Prompting)",
    definition: "ヒントやキーワードを与えて、AIの生成内容を特定の方向に誘導する手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 90,
    term: "生成知識プロンプティング (Generated Knowledge Prompting)",
    definition: "AIにまず関連知識を生成させ、それを使って回答させることで精度を高める手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 91,
    term: "デリミタ (区切り文字)",
    definition: "プロンプト内で、指示と入力テキストなどを明確に分けるための記号（###, \"\"\", ---など）。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 92,
    term: "出力形式の指定",
    definition: "「表形式で」「JSONで」「箇条書きで」など、AIの出力フォーマットを具体的に指示すること。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 93,
    term: "コンテキストの提供",
    definition: "背景情報や前提条件を詳しく伝えることで、AIの回答の質を向上させること。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 94,
    term: "制約条件の付与",
    definition: "「〇〇文字以内で」「専門用語を使わずに」など、生成内容に対する制限を設けること。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 95,
    term: "役割ロールプレイング",
    definition: "AIに特定の役割（教師、コンサルタントなど）を演じさせることで、口調や視点を調整する。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 96,
    term: "再帰的プロンプティング",
    definition: "AIの出力を次のプロンプトの入力として使い、段階的に成果物を洗練させる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 97,
    term: "メタプロンプト",
    definition: "プロンプトを作成するためのプロンプト。AIにプロンプトを改善させる際などに使う。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 98,
    term: "ゴールシークプロンプト",
    definition: "最終的な目標だけを伝え、そのために必要な手順や情報をAIに考えさせる手法。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 99,
    term: "否定命令 vs 肯定命令",
    definition: "「〇〇しないで」よりも「〇〇して」という肯定形の指示の方が、AIは従いやすい傾向がある。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  },
  {
    id: 100,
    term: "プロンプトインジェクション対策",
    definition: "入力を区切り文字で囲む、入力の長さを制限するなどの防御策。",
    chapter: "第5章：テキスト生成AIのプロンプト制作と実例"
  }
];