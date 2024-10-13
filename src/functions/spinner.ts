class Spinner {
  private frames: string[];
  private interval: NodeJS.Timeout | null;
  private currentFrame: number;
  private message: string;

  constructor() {
    this.frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    this.interval = null;
    this.currentFrame = 0;
    this.message = "";
  }

  public start(message: string = "Loading..."): void {
    this.message = message;
    this.currentFrame = 0;
    this.interval = setInterval(() => {
      process.stdout.write(
        `\r${this.frames[this.currentFrame]} ${this.message}`
      );
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 80);
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    process.stdout.write("\r\x1b[K"); // Clear the line
  }

  public updateMessage(message: string): void {
    this.message = message;
  }
}

export default Spinner;