import { API_KEY } from '../utils/constants'

export async function createSuperhero(superhero: { name: string; attributes: object }) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(superhero)

    const xhr = new XMLHttpRequest()

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        if (this.status >= 200 && this.status < 300) {
          resolve(this.responseText)
        } else {
          reject(new Error(`Failed to create superhero: ${this.statusText}`))
        }
      }
    })

    xhr.open('POST', 'https://codetest-api.applivery.io/pentathlon/heroes/')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', API_KEY)

    xhr.send(data)
  })
}

export async function getHeroes() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(this.responseText))
        } else {
          reject(new Error(`Failed to fetch heroes: ${this.statusText}`))
        }
      }
    })

    xhr.open('GET', 'https://codetest-api.applivery.io/pentathlon/heroes/')
    xhr.setRequestHeader('Authorization', API_KEY)

    xhr.send()
  })
}

export function editSuperhero(
  heroId: string,
  name: string,
  attributes: {
    agility: number
    strength: number
    weight: number
    endurance: number
    charisma: number
  }
) {
  const data = JSON.stringify({
    name,
    attributes,
  })

  const xhr = new XMLHttpRequest()

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText)
    }
  })

  xhr.open('PUT', `https://codetest-api.applivery.io/pentathlon/heroes/${heroId}`)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Authorization', API_KEY)

  xhr.send(data)
}

export function removeSuperhero(heroId: string) {
  const xhr = new XMLHttpRequest()

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText)
    }
  })

  xhr.open('DELETE', `https://codetest-api.applivery.io/pentathlon/heroes/${heroId}`)
  xhr.setRequestHeader('Authorization', API_KEY)

  xhr.send(null)
}
