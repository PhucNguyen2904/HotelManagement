export function ContactMap() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
            Bản Đồ Vị Trí
          </h2>
          <p className="text-[var(--color-text)]/75">
            Khách Sạn Ngân Hà tọa lạc tại đảo Quan Lạn, Vịnh Bái Tử Long
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--color-secondary)]/25 shadow-sm">
          <iframe
            src="https://www.google.com/maps?q=Quan+L%E1%BA%A1n,+V%C3%A2n+%C4%90%E1%BB%93n,+Qu%E1%BA%A3ng+Ninh&output=embed"
            width="100%"
            height="480"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ Khách Sạn Ngân Hà"
          />
        </div>
      </div>
    </section>
  );
}
