export class ActivityFilterBy {
  options: {
    year?: boolean;
    month?: boolean;
    day?: boolean;
    hour?: boolean;
  };
  range: [string, string];
}
