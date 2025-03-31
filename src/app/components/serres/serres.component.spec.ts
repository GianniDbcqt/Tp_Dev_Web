import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerresComponent } from './serres.component';

describe('SerresComponent', () => {
  let component: SerresComponent;
  let fixture: ComponentFixture<SerresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
