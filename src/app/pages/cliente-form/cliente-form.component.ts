// src/app/pages/cliente-form/cliente-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// Imports do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent {
  clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Criamos o formulário com seus campos e validadores
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf_cnpj: ['', [Validators.required]],
      email: ['', [Validators.email]],
      telefone: [''],
      endereco: [''],
      idade: [''],
      lead_score: [5] // Valor padrão
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.clienteService.createCliente(this.clienteForm.value).subscribe({
        next: () => {
          this.snackBar.open('Cliente cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/']); // Volta para a lista de clientes
        },
        error: (err) => {
          console.error('Erro ao cadastrar cliente', err);
          this.snackBar.open('Erro ao cadastrar cliente. Verifique os dados.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}