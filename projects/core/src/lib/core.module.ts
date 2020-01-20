import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpEasyService } from './http-easy.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
})
export class CoreModule {

  public forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        HttpEasyService
      ]
    }
  }

}
