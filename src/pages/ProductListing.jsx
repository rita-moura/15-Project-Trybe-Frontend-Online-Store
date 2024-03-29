import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AsideCategory from '../components/AsideCategory';
import { CartSvg } from '../assets/ExportImages';
import { getProductsFromCategoryAndQuery } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../assets/styles/Header.css';
import { addCartItem } from '../services/cartManipulation';

export default class ProductListing extends Component {
  state = {
    productList: [],
    searchValue: '',
    searched: false,
    cartegorySelected: '',
  };

  productSearch = ({ target }) => {
    const { value } = target;
    this.setState(({
      searchValue: value,
    }));
  };

  search = async (event) => {
    event.preventDefault();
    const { searchValue } = this.state;
    const produtos = await getProductsFromCategoryAndQuery(null, searchValue);

    this.setState(({
      productList: produtos.results,
      searchValue: '',
      searched: true,
    }));
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, async () => {
      const { cartegorySelected } = this.state;
      const productList = await getProductsFromCategoryAndQuery(cartegorySelected, null);
      this.setState({
        productList: productList.results,
        searched: true,
      });
    });
  };

  render() {
    const { productList, searchValue, searched } = this.state;

    let productsResults = productList.map((productInfos) => (
      <section key={ productInfos.id }>
        <ProductCard
          { ...productInfos }
        />
        <button
          type="button"
          data-testid="product-add-to-cart"
          onClick={ () => addCartItem(productInfos) }
        >
          Adicionar ao carrinho
        </button>
      </section>
    ));
    productsResults = productsResults.length ? productsResults
      : <p>Nenhum produto foi encontrado</p>;

    return (
      <main>
        <header className="Header">
          <form className="search-form" onSubmit={ this.search }>
            <input
              className="search-form-input"
              type="text"
              data-testid="query-input"
              onChange={ this.productSearch }
              value={ searchValue }
              placeholder="Digite o que você busca"
            />
            <button
              className="search-form-button"
              data-testid="query-button"
              type="button"
              onClick={ this.search }
            >
              Buscar
            </button>
          </form>
          <Link
            to="/cart"
            data-testid="shopping-cart-button"
          >
            <CartSvg stroke="blue" />
          </Link>
        </header>
        <main className="flex-row">
          <AsideCategory handleChange={ this.handleChange } />
          <section className="flex-row flex-wrap">
            {
              (!productList.length && !searched) && (
                <h3
                  data-testid="home-initial-message"
                >
                  Digite algum termo de pesquisa ou escolha uma categoria.
                </h3>
              )
            }
            {
              searched && productsResults
            }
          </section>
        </main>
      </main>
    );
  }
}
