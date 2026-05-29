import { ComposerProvider } from "./state";
import { Uploader } from "./components/Uploader";
import { EditorCanvas } from "./components/EditorCanvas";
import { ControlPanel } from "./components/ControlPanel";
import { ExportButton } from "./components/ExportButton";
import { UploadProvider } from "./components/UploadProvider";

function App() {
  return (
    <ComposerProvider>
      <UploadProvider>
        <div className="app">
          <header className="app-header">
            <h1>UI Builder</h1>
            <div className="header-actions">
              <Uploader />
              <ExportButton />
            </div>
          </header>
          <main className="app-main">
            <EditorCanvas />
            <ControlPanel />
          </main>
        </div>
      </UploadProvider>
    </ComposerProvider>
  );
}

export default App;
