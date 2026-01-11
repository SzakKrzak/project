import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface LoginScreenProps {
  onLogin: (name: string, apartmentNumber: string, password: string) => Promise<void>;
  error?: string | null;
}

export function LoginScreen({ onLogin, error: externalError }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name && apartmentNumber && password) {
      try {
        setLoading(true);
        await onLogin(name, apartmentNumber, password);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Błąd logowania');
      } finally {
        setLoading(false);
      }
    }
  };

  const displayError = externalError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-center">posprzataj.se</CardTitle>
          <CardDescription className="text-center">
            Zaloguj się do systemu sprzątania
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Imię</Label>
              <Input
                id="name"
                type="text"
                placeholder="Wprowadź swoje imię"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Numer lokalu</Label>
              <Input
                id="apartment"
                type="text"
                placeholder="Wprowadź numer lokalu"
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="Wprowadź hasło"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
            {displayError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {displayError}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
