import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';

@Injectable()
export class ViewService {
  render(viewName: string, data?: object) {
    return ejs.renderFile(`./src/views/${viewName}.ejs`, data);
  }
}
