import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainervideoComponent } from './trainervideo.component';

describe('TrainervideoComponent', () => {
  let component: TrainervideoComponent;
  let fixture: ComponentFixture<TrainervideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainervideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainervideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
