export class LevelManager {
  public timeLeft: number;
  public initialTime: number;
  public enemiesKilled: number = 0;
  public totalEnemies: number;
  public boosterUsed: boolean = false;

  constructor(timeLimit: number, totalEnemies: number) {
    this.timeLeft = timeLimit;
    this.initialTime = timeLimit;
    this.totalEnemies = totalEnemies;
  }

  public update(deltaSeconds: number): void {
    this.timeLeft -= deltaSeconds;
  }

  public registerKill(): void {
    this.enemiesKilled++;
  }

  public useBooster(): boolean {
    if (this.boosterUsed) return false;

    this.timeLeft += 10;

    this.boosterUsed = true;

    return true;
  }

  public get isWin(): boolean {
    return this.enemiesKilled >= this.totalEnemies;
  }

  public get isLose(): boolean {
    return this.timeLeft <= 0;
  }

  public getStars(): number {
    const totalTime = this.initialTime;
    const timeSpent = totalTime - this.timeLeft;

    if (timeSpent <= totalTime / 3) {
      return 3;
    } else if (timeSpent <= totalTime * 2 / 3) {
      return 2;
    } else {
      return 1;
    }
  }
}
