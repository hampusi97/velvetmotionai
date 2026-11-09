import os
import subprocess

print("📥 Deploying Universal AI Character Importer Suite...\n")

page_path = "src/app/page.tsx"
if os.path.exists(page_path):
    with open(page_path, "r", encoding="utf-8") as f:
        code = f.read()

    # 1. Import CharacterImporterModal
    if "CharacterImporterModal" not in code:
        code = code.replace(
            'import { VelvetGramModal } from "../components/VelvetGramModal";',
            'import { VelvetGramModal } from "../components/VelvetGramModal";\nimport { CharacterImporterModal, ImportedCompanion } from "../components/CharacterImporterModal";'
        )

    # 2. Add showImporterModal state
    if "showImporterModal" not in code:
        code = code.replace(
            "const [showGramModal, setShowGramModal] = useState(false);",
            "const [showGramModal, setShowGramModal] = useState(false);\n  const [showImporterModal, setShowImporterModal] = useState(false);"
        )

    # 3. Add handleImportCompanion
    handler_code = """  // Import Character Card (Character.ai, TavernAI, Chub, or Viral Templates)
  const handleImportCompanion = (imported: ImportedCompanion) => {
    const newComp: Companion = {
      id: imported.id,
      name: imported.name,
      age: imported.age,
      tagline: imported.tagline,
      category: imported.category,
      avatar: imported.avatar,
      video: imported.video || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: imported.voiceIntro || `Hey there, I am ${imported.name}. Welcome to our private chamber.`,
      initialMessage: imported.initialMessage,
      tags: imported.tags || ["Imported", "VIP"],
      intimacy: imported.intimacy || 70,
      vaultPhotos: imported.vaultPhotos || [imported.avatar]
    };
    setCompanions(prev => [newComp, ...prev]);
    setSelectedGirl(newComp);
    setActiveTab("chats");
    setShowImporterModal(false);
  };
"""
    if "handleImportCompanion" not in code:
        code = code.replace(
            "  // Trigger Interactive Branching Date Scenario",
            handler_code + "\n  // Trigger Interactive Branching Date Scenario"
        )

    # 4. Add "📥 Import AI Girl" button in top navbar
    navbar_btn = """          {/* 📥 Import AI Girl Button */}
          <button
            onClick={() => setShowImporterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/50 text-pink-300 hover:bg-pink-600 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>📥</span> Import AI Girl
          </button>
"""
    if "Import AI Girl Button" not in code:
        code = code.replace(
            '{/* 🎬 Velvet Gram Vertical Reels Button */}',
            navbar_btn + '\n          {/* 🎬 Velvet Gram Vertical Reels Button */}'
        )

    # 5. Add Import button in sidebar as well for quick access
    sidebar_btn = """              <button
                onClick={() => setShowImporterModal(true)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 border border-pink-500/30 text-pink-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>📥</span> Import Character (.json)
              </button>
"""
    if "Import Character (.json)" not in code:
        code = code.replace(
            '</div>\n            </div>\n\n            <div className="p-2 space-y-1',
            sidebar_btn + '</div>\n            </div>\n\n            <div className="p-2 space-y-1'
        )

    # 6. Mount CharacterImporterModal
    modal_mount = """      {/* UNIVERSAL AI CHARACTER IMPORTER MODAL */}
      <CharacterImporterModal
        isOpen={showImporterModal}
        onClose={() => setShowImporterModal(false)}
        onImport={handleImportCompanion}
      />
"""
    if "UNIVERSAL AI CHARACTER IMPORTER MODAL" not in code:
        code = code.replace(
            '{/* VELVET GRAM VERTICAL REELS MODAL */}',
            modal_mount + '\n      {/* VELVET GRAM VERTICAL REELS MODAL */}'
        )

    with open(page_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("  + Injected Universal AI Character Importer into page.tsx")

print("\n✨ Character Importer update completed.")
