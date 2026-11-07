export default function CounterCommandUsage() {
  return (
    <div className="flex flex-col h-full gap-4 p-6 mx-auto">
      <h1 className="text-lg font-extrabold text-center">Utilização</h1>

      <section className="grid gap-2">
        <h3>1. Registre o comando</h3>
        <ul className="grid gap-1 text-muted-foreground text-sm">
          <li>Copie o comando e cole no chat da Twitch.</li>
          <li>
            Com a opção de <em>alterar o valor</em>: cadastre pelo painel do StreamElements.
          </li>
        </ul>
      </section>

      <section className="grid gap-2">
        <h3>2. Consulte o valor</h3>
        <ul className="grid gap-1 text-muted-foreground text-sm">
          <li>
            <span className="text-foreground text-base">!contador</span> - retorna o valor atual do contador.
          </li>
        </ul>
      </section>

      <section className="grid gap-2">
        <h3>3. Altere o valor</h3>
        <p className="text-muted-foreground text-sm">
          Requer a opção <em>alterar o valor</em> e um token com a permissão <em>Contador</em>. O valor é enviado à API
          com seu token e nível de acesso, e só passa quem tiver permissão igual ou superior à selecionada.
        </p>
        <ul className="grid gap-1 text-muted-foreground text-sm">
          <li>
            <span className="text-foreground text-base">!contador add</span> - soma 1 ao valor.
          </li>
          <li>
            <span className="text-foreground text-base">!contador add 5</span> (ou{" "}
            <span className="text-foreground text-base">+</span>,{" "}
            <span className="text-foreground text-base">increment</span>) - soma 5 ao valor atual.
          </li>
          <li>
            <span className="text-foreground text-base">!contador remove 5</span> (ou{" "}
            <span className="text-foreground text-base">-</span>,{" "}
            <span className="text-foreground text-base">decrement</span>) - subtrai 5 do valor atual.
          </li>
          <li>
            <span className="text-foreground text-base">!contador 10</span> (ou{" "}
            <span className="text-foreground text-base">set 10</span>) - define o valor atual como 10.
          </li>
          <li>
            <span className="text-foreground text-base">!contador reset</span> - zera o contador.
          </li>
          <li>
            <span className="text-foreground text-base">!contador + 5 &lt;mensagem&gt;</span> - mensagem de alteração
            opcional.
          </li>
        </ul>
      </section>
    </div>
  );
}
