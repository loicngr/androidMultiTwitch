import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamsPage } from './streams.page';

describe('StreamsPage', () => {
  let component: StreamsPage;
  let fixture: ComponentFixture<StreamsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
