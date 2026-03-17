import './App.css';
import { EngraveForm } from './components/EngraveForm';
import { ExtractForm } from './components/ExtractForm';

function App() {
    return (
        <div className="app-layout">
            <header>
                <h1>Image Watermarking Studio</h1>
            </header>

            <main className="forms-wrapper">
                <EngraveForm />
                <ExtractForm />
            </main>
        </div>
    );
}

export default App;
