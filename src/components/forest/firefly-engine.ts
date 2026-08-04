type Point = { x: number; y: number };
type FireflyProfile = 'curious' | 'distant' | 'wanderer';

const random = (min: number, max: number) => min + Math.random() * (max - min);
const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));

const quadraticPoint = (start: Point, control: Point, end: Point, progress: number): Point => {
  const inverse = 1 - progress;

  return {
    x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
    y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
  };
};

export class FireflyController {
  private position: Point = { x: 0, y: 0 };
  private stopped = false;
  private cursor: Point | null = null;
  private cursorMovedAt = 0;
  private curiosityAvailableAt = 0;
  private readonly trackCursor = (event: PointerEvent) => {
    const bounds = this.habitat.getBoundingClientRect();
    this.cursor = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    this.cursorMovedAt = performance.now();
  };
  private readonly forgetCursor = () => {
    this.cursor = null;
  };

  constructor(
    private readonly element: HTMLElement,
    private readonly habitat: HTMLElement,
    private readonly profile: FireflyProfile = 'curious',
  ) {}

  start() {
    if (this.profile === 'curious' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.habitat.addEventListener('pointermove', this.trackCursor, { passive: true });
      this.habitat.addEventListener('pointerleave', this.forgetCursor);
    }

    void this.live();
  }

  stop() {
    this.stopped = true;
    this.element.getAnimations().forEach((animation) => animation.cancel());
    this.habitat.removeEventListener('pointermove', this.trackCursor);
    this.habitat.removeEventListener('pointerleave', this.forgetCursor);
  }

  private async live() {
    await wait(
      this.profile === 'distant'
        ? random(2200, 6200)
        : this.profile === 'wanderer'
          ? random(3800, 8500)
          : random(250, 700),
    );

    while (!this.stopped) {
      this.element.dataset.fireflyState = 'waking';
      this.position = this.pickPoint('arrival');
      this.place(this.position);

      await this.fade(
        0,
        this.profile === 'distant'
          ? random(0.36, 0.56)
          : this.profile === 'wanderer'
            ? random(0.52, 0.7)
            : random(0.84, 1),
        this.profile === 'distant'
          ? random(1800, 2800)
          : this.profile === 'wanderer'
            ? random(1200, 1900)
            : random(800, 1250),
      );
      if (this.stopped) return;

      this.element.dataset.fireflyState = 'exploring';
      await this.flyTo(
        this.pickPoint('explore'),
        this.profile === 'distant' ? random(6200, 9000) : random(3600, 5200),
      );
      await this.rest();

      if (this.shouldInvestigate()) await this.investigateCursor();

      await this.flyTo(
        this.pickPoint('explore'),
        this.profile === 'distant' ? random(5600, 8200) : random(3000, 4600),
      );

      if (Math.random() > 0.42) await this.rest();

      this.element.dataset.fireflyState = 'leaving';
      await Promise.all([
        this.flyTo(
          this.pickPoint('departure'),
          this.profile === 'distant' ? random(4200, 6200) : random(2600, 3800),
        ),
        this.fade(
          Number(getComputedStyle(this.element).opacity),
          0,
          this.profile === 'distant' ? random(3200, 4800) : random(2100, 3100),
        ),
      ]);

      this.element.dataset.fireflyState = 'sleeping';
      await wait(
        this.profile === 'distant'
          ? random(9000, 19000)
          : this.profile === 'wanderer'
            ? random(6500, 14000)
            : random(2200, 6000),
      );
    }
  }

  private async rest() {
    this.element.dataset.fireflyState = 'resting';
    await this.element.animate(
      [
        { transform: this.transform(this.position) },
        { transform: this.transform({ x: this.position.x + random(-5, 5), y: this.position.y + random(-7, 4) }) },
        { transform: this.transform(this.position) },
      ],
      { duration: random(1100, 2300), easing: 'ease-in-out' },
    ).finished.catch(() => undefined);
  }

  private shouldInvestigate() {
    const now = performance.now();
    const cursorHasSettled = now - this.cursorMovedAt > 320;
    const cursorIsRecent = now - this.cursorMovedAt < 4200;

    return Boolean(
      this.profile === 'curious' &&
      this.cursor &&
      cursorHasSettled &&
      cursorIsRecent &&
      now > this.curiosityAvailableAt &&
      Math.random() > 0.28,
    );
  }

  private async investigateCursor() {
    if (!this.cursor) return;

    this.element.dataset.fireflyState = 'curious';
    const cursor = { ...this.cursor };
    const radius = random(58, 92);
    const startAngle = random(0, Math.PI * 2);
    const approach = {
      x: cursor.x + Math.cos(startAngle) * radius,
      y: cursor.y + Math.sin(startAngle) * radius,
    };

    await this.flyTo(approach, random(1800, 2800));
    if (this.stopped || !this.cursor) return;

    const orbitFrames = Array.from({ length: 13 }, (_, index) => {
      const progress = index / 12;
      const angle = startAngle + progress * Math.PI * random(1.35, 1.8);
      const breathingRadius = radius + Math.sin(progress * Math.PI * 3) * 9;
      const point = {
        x: cursor.x + Math.cos(angle) * breathingRadius,
        y: cursor.y + Math.sin(angle) * breathingRadius,
      };

      return { transform: this.transform(point) };
    });
    const animation = this.element.animate(orbitFrames, {
      duration: random(1800, 2800),
      easing: 'ease-in-out',
      fill: 'forwards',
    });

    await animation.finished.catch(() => undefined);
    const finalFrame = orbitFrames[orbitFrames.length - 1];
    const matrix = new DOMMatrix(finalFrame.transform);
    this.position = { x: matrix.m41, y: matrix.m42 };
    this.place(this.position);
    animation.cancel();
    this.curiosityAvailableAt = performance.now() + random(10000, 18000);
  }

  private async flyTo(destination: Point, duration: number) {
    const start = this.position;
    const distance = Math.hypot(destination.x - start.x, destination.y - start.y);
    const control = {
      x: (start.x + destination.x) / 2 + random(-distance * 0.28, distance * 0.28),
      y: (start.y + destination.y) / 2 + random(-Math.max(28, distance * 0.22), Math.max(28, distance * 0.22)),
    };
    const steps = 8;
    const keyframes = Array.from({ length: steps + 1 }, (_, index) => {
      const progress = index / steps;
      const point = quadraticPoint(start, control, destination, progress);
      const drift = Math.sin(progress * Math.PI * random(1.6, 2.4)) * random(2, 7);

      return { transform: this.transform({ x: point.x, y: point.y + drift }) };
    });

    const animation = this.element.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.45, 0.05, 0.28, 0.98)',
      fill: 'forwards',
    });

    await animation.finished.catch(() => undefined);

    this.position = destination;
    this.place(destination);
    animation.cancel();
  }

  private async fade(from: number, to: number, duration: number) {
    const animation = this.element.animate([{ opacity: from }, { opacity: to }], {
      duration,
      easing: 'ease-in-out',
      fill: 'forwards',
    });

    await animation.finished.catch(() => undefined);
    this.element.style.opacity = String(to);
    animation.cancel();
  }

  private pickPoint(purpose: 'arrival' | 'explore' | 'departure'): Point {
    const bounds = this.habitat.getBoundingClientRect();

    if (purpose === 'departure') {
      const leavesLeft = Math.random() > 0.5;

      return {
        x: leavesLeft ? random(-30, -10) : random(bounds.width + 10, bounds.width + 30),
        y: random(bounds.height * 0.14, bounds.height * 0.72),
      };
    }

    return {
      x: purpose === 'arrival'
        ? random(bounds.width * 0.12, bounds.width * 0.88)
        : random(bounds.width * 0.08, bounds.width * 0.92),
      y: purpose === 'arrival'
        ? random(
            this.profile === 'wanderer' ? bounds.height * 0.38 : bounds.height * 0.16,
            this.profile === 'distant'
              ? bounds.height * 0.38
              : this.profile === 'wanderer'
                ? bounds.height * 0.68
                : bounds.height * 0.46,
          )
        : random(
            this.profile === 'wanderer' ? bounds.height * 0.32 : bounds.height * 0.12,
            this.profile === 'distant'
              ? bounds.height * 0.5
              : this.profile === 'wanderer'
                ? bounds.height * 0.78
                : bounds.height * 0.7,
          ),
    };
  }

  private place(point: Point) {
    this.element.style.transform = this.transform(point);
  }

  private transform(point: Point) {
    return `translate3d(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px, 0)`;
  }
}
