import { Injectable } from '@nestjs/common';
import { Eta } from 'eta';
import * as path from 'path';

@Injectable()
export class ViewService {
  private eta: Eta;

  constructor() {
    this.eta = new Eta({ views: path.resolve('src/templates') });
  }

  render(template: string, data?: object) {
    return this.eta.render(template, data);
  }
}
