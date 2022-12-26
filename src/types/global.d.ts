interface Response {
  id: string;
  Spele: Spele;
}

interface Spele {
  Laiks: String;
  Skatitaji: number;
  Vieta: string;
  T: Tiesnesi[];
  Komanda: Komanda[];
}

interface Tiesnesi {
  Uzvards: string;
  Vards: string;
}

interface Komanda {
  Nosaukums: string;
  Speletaji: Speletaji;
  Pamatsastavs: Pamatsastavs;
  Varti: Varti;
  Mainas: Mainas;
  Sodi: Sodi;
}

interface Speletaji {
  Speletajs: Speletajs[];
}

interface Speletajs {
  Loma?: string;
  Nr: number;
  Uzvards?: string;
  Vards?: string;
}

interface Pamatsastavs {
  Speletajs: Speletajs[];
}

interface Varti {
  VG: VG[];
}

interface VG {
  Laiks: string;
  P?: { Nr: Number }[];
  Nr: number;
  Sitiens: string;
}

interface Mainas {
  Maina: Maina;
}

interface Maina {
  Laiks: string;
  Nr1: Number;
  Nr2: Number;
}

interface Sodi {
  Sods: Sods[];
}

interface Sods {
  Laiks: string;
  Nr: Number;
}

interface RezultativakieSpeletaji {
  player: string;
  club: string;
  goals: number;
  assists: number;
  points: number;
}

interface RupjakieSpeletaji {
  player: string;
  club: string;
  violations: number;
}

interface KomanduPozicijas {
  club: string;
  totalPoints: number;
  regulationWins: number;
  regulationLosses: number;
  overtimeWins: number;
  overtimeLosses: number;
  goalsScored: number;
  goalsConceded: number;
}
