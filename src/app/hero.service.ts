import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Hero } from './hero'
import { HEROES } from './mock-heroes'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { MessageService } from './message.service'

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes')
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_=> this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
    )
  }
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    this.messageService.add(`HeroService: fetch hero id=${id}`)
    return this.http.get<Hero>(url)
      .pipe(
      tap(_ => this.log(`fetched hero id: ${id}`)),
      catchError(this.handleError<Hero>(`getHero id: ${id}`))
    )
  }
  updateHero(hero: Hero): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(this.heroesUrl, hero, httpOptions)
    .pipe(
      tap(_ => this.log(`update hero id: ${hero.id}`)),
      catchError(this.handleError<any>(`updateHero id: ${hero.id}`))
    )
  }
  addHero(hero: Hero): Observable<Hero>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`add hero w/ id= ${newHero.id}`)),
        catchError(this.handleError<Hero>(`addHero`))
    )
   }
  deleteHero(hero: Hero | number): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const id = typeof hero === 'number' ? hero : hero.id
    const url = `${this.heroesUrl}/${ id }`
    return this.http.delete<Hero>(url, httpOptions)
    .pipe(
      tap(_ => this.log(`delete hero id= ${id}`)),
      catchError(this.handleError<Hero>(`deleteHero`))
    )
   }
}
